const axios = require('axios');
const { Op, fn, col } = require('sequelize');
const { Invoice, Person } = require('../models');

const startOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

class InsightsController {
  async index(req, res) {
    const tenant_id = req.user.tenant_id;
    const monthStart = startOfMonth();
    const [customers, newCustomers, invoiceCounts, paidTotal, recentInvoices, paidInvoices] = await Promise.all([
      Person.count({ where: { tenant_id } }),
      Person.count({ where: { tenant_id, createdAt: { [Op.gte]: monthStart } } }),
      Invoice.findAll({
        where: { tenant_id },
        attributes: ['status', [fn('COUNT', col('id')), 'count']],
        group: ['status'],
        raw: true,
      }),
      Invoice.sum('amount', { where: { tenant_id, status: 'PAID' } }),
      Invoice.findAll({
        where: { tenant_id },
        include: [{ model: Person, attributes: ['name'] }],
        order: [['createdAt', 'DESC']],
        limit: 5,
      }),
      Invoice.findAll({
        where: { tenant_id, status: 'PAID' },
        attributes: ['amount', 'paid_at'],
        raw: true,
      }),
    ]);
    const byStatus = Object.fromEntries(invoiceCounts.map(({ status, count }) => [status, Number(count)]));
    const metrics = {
      customers,
      newCustomers,
      paidRevenue: Number(paidTotal || 0),
      pendingInvoices: byStatus.PENDING || 0,
      paidInvoices: byStatus.PAID || 0,
      overdueInvoices: byStatus.OVERDUE || 0,
    };
    const revenueByMonth = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      const month = date.getMonth();
      const year = date.getFullYear();
      const value = paidInvoices
        .filter((invoice) => invoice.paid_at && new Date(invoice.paid_at).getMonth() === month && new Date(invoice.paid_at).getFullYear() === year)
        .reduce((sum, invoice) => sum + Number(invoice.amount), 0);
      return { label: date.toLocaleDateString('pt-BR', { month: 'short' }), value };
    });

    let insight = `O tenant possui ${metrics.customers} clientes, ${metrics.newCustomers} novos neste mês e ${metrics.pendingInvoices} cobranças pendentes. A receita confirmada é de R$ ${metrics.paidRevenue.toFixed(2)}.`;
    if (process.env.GROQ_API_KEY) {
      try {
        const { data } = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'Você é um analista financeiro. Responda em português com um parágrafo curto, objetivo e sem inventar dados.' },
            { role: 'user', content: `Analise estas métricas SaaS do tenant: ${JSON.stringify(metrics)}` },
          ],
        }, { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` } });
        insight = data.choices?.[0]?.message?.content || insight;
      } catch {
        // Mantém o resumo calculado quando a API externa estiver indisponível.
      }
    }
    return res.json({ metrics, insight, recentInvoices, revenueByMonth });
  }
}

module.exports = new InsightsController();
