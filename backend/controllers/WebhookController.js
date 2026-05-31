const { Invoice, WebhookEvent, BillingPlan } = require('../models');
const { recordAudit } = require('../services/audit');

const paidEvents = new Set(['PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED']);
const overdueEvents = new Set(['PAYMENT_OVERDUE']);
const canceledEvents = new Set(['PAYMENT_DELETED', 'PAYMENT_REFUNDED']);

class WebhookController {
  async asaas(req, res) {
    if (!process.env.ASAAS_WEBHOOK_TOKEN || req.headers['asaas-access-token'] !== process.env.ASAAS_WEBHOOK_TOKEN) {
      return res.status(401).json({ error: 'Webhook não autorizado.' });
    }

    const { id, event, payment } = req.body;
    if (!id || !event || !payment?.id) return res.status(400).json({ error: 'Evento inválido.' });
    const [, created] = await WebhookEvent.findOrCreate({
      where: { event_id: id },
      defaults: { gateway: 'asaas', event_id: id, event_type: event },
    });
    if (!created) return res.status(200).json({ received: true, duplicate: true });

    let invoice = await Invoice.findOne({ where: { gateway_payment_id: payment.id } });
    if (!invoice && event === 'PAYMENT_CREATED' && payment.subscription) {
      const plan = await BillingPlan.findOne({ where: { gateway_subscription_id: payment.subscription } });
      if (plan) {
        invoice = await Invoice.create({
          tenant_id: plan.tenant_id,
          person_id: plan.person_id,
          created_by: plan.created_by,
          gateway_payment_id: payment.id,
          description: payment.description || plan.description,
          amount: payment.value,
          due_date: payment.dueDate,
          billing_type: payment.billingType || plan.billing_type,
          payment_url: payment.invoiceUrl || payment.bankSlipUrl || null,
        });
      }
    }
    if (!invoice) return res.status(200).json({ received: true });
    if (paidEvents.has(event)) await invoice.update({ status: 'PAID', paid_at: new Date() });
    if (overdueEvents.has(event)) await invoice.update({ status: 'OVERDUE' });
    if (canceledEvents.has(event)) await invoice.update({ status: 'CANCELED' });
    await recordAudit({
      tenantId: invoice.tenant_id,
      action: 'INVOICE_WEBHOOK_UPDATED',
      entityType: 'Invoice',
      entityId: invoice.id,
      details: { event },
    });
    return res.status(200).json({ received: true });
  }
}

module.exports = new WebhookController();
