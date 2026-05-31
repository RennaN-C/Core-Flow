const { Invoice, Person, BillingPlan } = require('../models');
const asaas = require('../services/asaas');
const { recordAudit } = require('../services/audit');

class FinanceController {
  async create(req, res) {
    try {
      const { personId, amount, dueDate, billingType = 'PIX', description } = req.body;
      if (!personId || !amount || !dueDate || !description) {
        return res.status(400).json({ error: 'Cliente, valor, vencimento e descrição são obrigatórios.' });
      }

      const person = await Person.findOne({ where: { id: personId, tenant_id: req.user.tenant_id } });
      if (!person) return res.status(404).json({ error: 'Cliente não encontrado neste tenant.' });
      if (!person.gateway_customer_id && !person.document) {
        return res.status(400).json({ error: 'Informe o CPF ou CNPJ do cliente antes de gerar cobranças.' });
      }

      if (!person.gateway_customer_id) {
        const customer = await asaas.createCustomer(person);
        await person.update({ gateway_customer_id: customer.id });
      }

      const payment = await asaas.createPayment({
        customerId: person.gateway_customer_id,
        amount,
        dueDate,
        billingType,
        description,
      });
      const pix = billingType === 'PIX' ? await asaas.getPixQrCode(payment.id) : {};
      const invoice = await Invoice.create({
        tenant_id: req.user.tenant_id,
        person_id: person.id,
        created_by: req.user.id,
        gateway: asaas.getProvider(),
        gateway_payment_id: payment.id,
        description,
        amount,
        due_date: dueDate,
        billing_type: billingType,
        payment_url: payment.invoiceUrl || payment.bankSlipUrl || null,
        pix_payload: pix.payload || null,
        pix_encoded_image: pix.encodedImage || null,
      });
      await recordAudit({ req, action: 'INVOICE_CREATED', entityType: 'Invoice', entityId: invoice.id });
      return res.status(201).json(invoice);
    } catch (error) {
      return res.status(error.statusCode || 502).json({ error: error.message || 'Erro ao gerar cobrança.' });
    }
  }

  async index(req, res) {
    const invoices = await Invoice.findAll({
      where: { tenant_id: req.user.tenant_id },
      include: [{ model: Person, attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
    });
    return res.json(invoices);
  }

  async createSubscription(req, res) {
    try {
      const { personId, amount, nextDueDate, billingType = 'PIX', cycle = 'MONTHLY', description } = req.body;
      if (!personId || !amount || !nextDueDate || !description) {
        return res.status(400).json({ error: 'Cliente, valor, primeiro vencimento e descrição são obrigatórios.' });
      }
      const person = await Person.findOne({ where: { id: personId, tenant_id: req.user.tenant_id } });
      if (!person) return res.status(404).json({ error: 'Cliente não encontrado neste tenant.' });
      if (!person.gateway_customer_id && !person.document) return res.status(400).json({ error: 'Informe o CPF ou CNPJ do cliente antes de gerar cobranças.' });
      if (!person.gateway_customer_id) {
        const customer = await asaas.createCustomer(person);
        await person.update({ gateway_customer_id: customer.id });
      }
      const subscription = await asaas.createSubscription({ customerId: person.gateway_customer_id, amount, nextDueDate, billingType, cycle, description });
      const plan = await BillingPlan.create({
        tenant_id: req.user.tenant_id,
        person_id: person.id,
        created_by: req.user.id,
        gateway_subscription_id: subscription.id,
        description,
        amount,
        cycle,
        billing_type: billingType,
      });
      await recordAudit({ req, action: 'BILLING_PLAN_CREATED', entityType: 'BillingPlan', entityId: plan.id });
      return res.status(201).json(plan);
    } catch (error) {
      return res.status(error.statusCode || 502).json({ error: error.message || 'Erro ao gerar cobrança recorrente.' });
    }
  }

  async subscriptions(req, res) {
    const plans = await BillingPlan.findAll({
      where: { tenant_id: req.user.tenant_id },
      include: [{ model: Person, attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
    });
    return res.json(plans);
  }

  async simulatePayment(req, res) {
    const invoice = await Invoice.findOne({
      where: {
        gateway_payment_id: req.params.gatewayPaymentId,
        tenant_id: req.user.tenant_id,
      },
    });
    if (!invoice) return res.status(404).json({ error: 'Cobrança não encontrada.' });
    if (!invoice.gateway_payment_id.startsWith('demo_payment_')) {
      return res.status(400).json({ error: 'Somente cobranças simuladas podem ser pagas manualmente.' });
    }
    await invoice.update({ status: 'PAID', paid_at: new Date() });
    await recordAudit({ req, action: 'DEMO_INVOICE_PAID', entityType: 'Invoice', entityId: invoice.id });
    return res.json(invoice);
  }

  async cancel(req, res) {
    const invoice = await Invoice.findOne({ where: { id: req.params.id, tenant_id: req.user.tenant_id } });
    if (!invoice) return res.status(404).json({ error: 'Cobranca nao encontrada.' });
    if (invoice.status !== 'PENDING') return res.status(400).json({ error: 'Somente cobrancas pendentes podem ser canceladas.' });
    await invoice.update({ status: 'CANCELED' });
    await recordAudit({ req, action: 'INVOICE_CANCELED', entityType: 'Invoice', entityId: invoice.id });
    return res.json(invoice);
  }

  async updateSubscriptionStatus(req, res) {
    const plan = await BillingPlan.findOne({ where: { id: req.params.id, tenant_id: req.user.tenant_id } });
    if (!plan) return res.status(404).json({ error: 'Cobranca automatica nao encontrada.' });
    const status = req.body.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE';
    await plan.update({ status });
    await recordAudit({ req, action: 'BILLING_PLAN_STATUS_UPDATED', entityType: 'BillingPlan', entityId: plan.id, details: { status } });
    return res.json(plan);
  }
}

module.exports = new FinanceController();
