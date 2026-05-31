const axios = require('axios');
const crypto = require('crypto');

const demoId = (prefix) => `${prefix}_${crypto.randomUUID()}`;
const provider = () => (process.env.PAYMENT_PROVIDER || 'demo').trim().toLowerCase();
const isDemo = () => provider() !== 'asaas';
const getProvider = () => (isDemo() ? 'demo' : 'asaas');

const getClient = () => {
  if (!process.env.ASAAS_API_KEY) {
    const error = new Error('Integracao Asaas selecionada, mas ASAAS_API_KEY nao foi configurada.');
    error.statusCode = 503;
    throw error;
  }

  return axios.create({
    baseURL: process.env.ASAAS_BASE_URL || 'https://api-sandbox.asaas.com/v3',
    headers: {
      access_token: process.env.ASAAS_API_KEY,
      'Content-Type': 'application/json',
    },
  });
};

const createCustomer = async (person) => {
  if (isDemo()) return { id: demoId('demo_customer') };
  const { data } = await getClient().post('/customers', {
    name: person.name,
    cpfCnpj: person.document,
    email: person.email,
    mobilePhone: person.phone,
  });
  return data;
};

const createPayment = async ({ customerId, amount, dueDate, billingType, description }) => {
  if (isDemo()) {
    const id = demoId('demo_payment');
    return {
      id,
      invoiceUrl: `/api/finance/invoices/${id}/demo-payment`,
      customer: customerId,
      value: amount,
      dueDate,
      billingType,
      description,
    };
  }
  const { data } = await getClient().post('/payments', {
    customer: customerId,
    billingType,
    value: amount,
    dueDate,
    description,
  });
  return data;
};

const getPixQrCode = async (paymentId) => {
  if (isDemo()) return { payload: `CORE_FLOW_DEMO_PIX|${paymentId}` };
  const { data } = await getClient().get(`/payments/${paymentId}/pixQrCode`);
  return data;
};

const createSubscription = async ({ customerId, amount, nextDueDate, billingType, cycle, description }) => {
  if (isDemo()) {
    return {
      id: demoId('demo_subscription'),
      customer: customerId,
      value: amount,
      nextDueDate,
      billingType,
      cycle,
      description,
    };
  }
  const { data } = await getClient().post('/subscriptions', {
    customer: customerId,
    billingType,
    value: amount,
    nextDueDate,
    cycle,
    description,
  });
  return data;
};

module.exports = { createCustomer, createPayment, getPixQrCode, createSubscription, getProvider };
