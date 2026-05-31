const { createLicenseSettings, getLicenseSettings, resolveLicensedProfile, resolveProfile } = require('../services/businessProfiles');
const { normalizeSystemPreferences } = require('../services/systemPreferences');

test('licenca preserva o nicho e os modulos gerados no cadastro', () => {
  const academia = resolveProfile({ profileId: 'academia' });
  const settings = { license: createLicenseSettings(academia) };
  const licensed = resolveLicensedProfile({ settings, businessType: 'varejo' });

  expect(licensed.id).toBe('academia');
  expect(licensed.enabledModules).toEqual(academia.enabledModules);
});

test('preferencias administrativas sao normalizadas com limites seguros', () => {
  const preferences = normalizeSystemPreferences({
    timezone: 'invalido',
    finance: { default_due_days: 120, default_billing_type: 'BOLETO' },
    notifications: { audit_alerts: false },
  });

  expect(preferences.timezone).toBe('America/Sao_Paulo');
  expect(preferences.finance.default_due_days).toBe(7);
  expect(preferences.finance.default_billing_type).toBe('BOLETO');
  expect(preferences.notifications.audit_alerts).toBe(false);
});

test('tenant legado recebe metadados de licenca sem perder o nicho salvo', () => {
  const license = getLicenseSettings({ settings: { profile_id: 'oficina', enabled_modules: ['crm', 'workorders'] }, businessType: 'varejo' });

  expect(license.profile_id).toBe('oficina');
  expect(license.enabled_modules).toEqual(['crm', 'workorders']);
});
