const defaults = {
  company_phone: '',
  timezone: 'America/Sao_Paulo',
  currency: 'BRL',
  date_format: 'DD/MM/YYYY',
  finance: {
    default_due_days: 7,
    default_billing_type: 'PIX',
    overdue_alerts: true,
  },
  notifications: {
    billing_updates: true,
    audit_alerts: true,
    license_alerts: true,
    weekly_summary: true,
  },
  interface: {
    compact_mode: false,
  },
};

const allowed = {
  timezone: ['America/Sao_Paulo', 'America/Manaus', 'America/Recife', 'America/Fortaleza'],
  currency: ['BRL', 'USD', 'EUR'],
  date_format: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
  billing_type: ['PIX', 'BOLETO', 'CREDIT_CARD'],
};

const pick = (value, choices, fallback) => choices.includes(value) ? value : fallback;
const bool = (value, fallback) => typeof value === 'boolean' ? value : fallback;
const dueDays = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 90 ? parsed : fallback;
};

const normalizeSystemPreferences = (input = {}, previous = {}) => {
  const merged = {
    ...defaults,
    ...previous,
    ...input,
    finance: { ...defaults.finance, ...(previous.finance || {}), ...(input.finance || {}) },
    notifications: { ...defaults.notifications, ...(previous.notifications || {}), ...(input.notifications || {}) },
    interface: { ...defaults.interface, ...(previous.interface || {}), ...(input.interface || {}) },
  };

  return {
    company_phone: typeof merged.company_phone === 'string' ? merged.company_phone.trim() : '',
    timezone: pick(merged.timezone, allowed.timezone, defaults.timezone),
    currency: pick(merged.currency, allowed.currency, defaults.currency),
    date_format: pick(merged.date_format, allowed.date_format, defaults.date_format),
    finance: {
      default_due_days: dueDays(merged.finance.default_due_days, defaults.finance.default_due_days),
      default_billing_type: pick(merged.finance.default_billing_type, allowed.billing_type, defaults.finance.default_billing_type),
      overdue_alerts: bool(merged.finance.overdue_alerts, defaults.finance.overdue_alerts),
    },
    notifications: {
      billing_updates: bool(merged.notifications.billing_updates, defaults.notifications.billing_updates),
      audit_alerts: bool(merged.notifications.audit_alerts, defaults.notifications.audit_alerts),
      license_alerts: bool(merged.notifications.license_alerts, defaults.notifications.license_alerts),
      weekly_summary: bool(merged.notifications.weekly_summary, defaults.notifications.weekly_summary),
    },
    interface: {
      compact_mode: bool(merged.interface.compact_mode, defaults.interface.compact_mode),
    },
  };
};

module.exports = { normalizeSystemPreferences };
