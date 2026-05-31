const asaas = require('../services/asaas');

afterEach(() => {
  delete process.env.PAYMENT_PROVIDER;
  delete process.env.ASAAS_API_KEY;
});

test('PIX demonstrativo continua ativo mesmo quando existe chave Asaas no ambiente', async () => {
  process.env.ASAAS_API_KEY = 'placeholder';

  const payment = await asaas.createPayment({
    customerId: 'customer-1',
    amount: 10,
    dueDate: '2026-06-10',
    billingType: 'PIX',
    description: 'Mensalidade',
  });
  const pix = await asaas.getPixQrCode(payment.id);

  expect(payment.id).toMatch(/^demo_payment_/);
  expect(pix.payload).toBe(`CORE_FLOW_DEMO_PIX|${payment.id}`);
});

test('Asaas explicito exige chave configurada', async () => {
  process.env.PAYMENT_PROVIDER = 'asaas';

  await expect(asaas.createPayment({
    customerId: 'customer-1',
    amount: 10,
    dueDate: '2026-06-10',
    billingType: 'PIX',
    description: 'Mensalidade',
  })).rejects.toThrow('ASAAS_API_KEY');
});
