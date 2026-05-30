const tenantConfigs = {
  gym: {
    personLabel: 'Aluno',
    financeLabel: 'Mensalidade',
    modules: ['person', 'finance', 'schedule', 'workout_plans']
  },
  clinic: {
    personLabel: 'Paciente',
    financeLabel: 'Consulta',
    modules: ['person', 'finance', 'schedule', 'inventory']
  },
  church: {
    personLabel: 'Membro',
    financeLabel: 'Dízimo/Oferta',
    modules: ['person', 'finance', 'events']
  }
};

const getTenantConfig = (businessType) => {
  return tenantConfigs[businessType] || tenantConfigs['default'];
};

module.exports = { getTenantConfig };