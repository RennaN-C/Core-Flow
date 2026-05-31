const mockUpdate = jest.fn();
jest.mock('../models', () => ({
  Invoice: { findOne: jest.fn().mockResolvedValue({ id: 'invoice-1', tenant_id: 'tenant-1', update: mockUpdate }) },
  WebhookEvent: { findOrCreate: jest.fn().mockResolvedValue([{}, true]) },
  BillingPlan: { findOne: jest.fn() },
}));
jest.mock('../services/audit', () => ({ recordAudit: jest.fn() }));
const WebhookController = require('../controllers/WebhookController');

const response = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => {
  process.env.ASAAS_WEBHOOK_TOKEN = 'webhook-token';
  jest.clearAllMocks();
});

test('webhook rejeita token inválido', async () => {
  const res = response();
  await WebhookController.asaas({ headers: {}, body: {} }, res);
  expect(res.status).toHaveBeenCalledWith(401);
});

test('webhook marca fatura recebida como paga', async () => {
  const res = response();
  await WebhookController.asaas({
    headers: { 'asaas-access-token': 'webhook-token' },
    body: { id: 'event-1', event: 'PAYMENT_RECEIVED', payment: { id: 'payment-1' } },
  }, res);
  expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ status: 'PAID' }));
  expect(res.status).toHaveBeenCalledWith(200);
});
