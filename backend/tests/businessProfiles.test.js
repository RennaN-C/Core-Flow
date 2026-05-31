const { listProfiles, resolveProfile } = require('../services/businessProfiles');

test('catalogo oferece diferentes nichos de negocio', () => {
  const profiles = listProfiles();
  expect(profiles.length).toBeGreaterThanOrEqual(10);
  expect(profiles.map(({ id }) => id)).toEqual(expect.arrayContaining(['varejo', 'academia', 'clinica', 'barbearia', 'igreja', 'servicos', 'restaurante', 'escola', 'petshop', 'oficina']));
});

test('perfil de academia adapta clientes, cobrancas e modulos', () => {
  const profile = resolveProfile({ profileId: 'academia' });
  expect(profile.customerLabel).toBe('Alunos');
  expect(profile.suggestedCharges).toContain('Mensalidade');
  expect(profile.customerFields.map(({ id }) => id)).toContain('plano');
  expect(profile.enabledModules).toContain('attendance');
  expect(profile.modules.length).toBeGreaterThanOrEqual(5);
  expect(profile.modules.find(({ id }) => id === 'attendance').options).toContain('Alertas de ausencia');
});

test('modulos habilitados sao limitados aos recursos do nicho', () => {
  const profile = resolveProfile({ profileId: 'oficina', enabledModules: ['crm', 'workorders', 'inexistente'] });
  expect(profile.enabledModules).toEqual(['crm', 'workorders']);
});
