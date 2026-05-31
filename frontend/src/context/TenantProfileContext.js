import { createContext } from 'react';

export const fallbackProfile = {
  id: 'varejo',
  name: 'Varejo e comercio',
  customerLabel: 'Clientes',
  customerSingular: 'Cliente',
  headline: 'Organize sua operacao em um unico fluxo.',
  customerFields: [],
  suggestedCharges: [],
  modules: [],
  enabledModules: [],
  operationalFeatures: [],
};

export const TenantProfileContext = createContext({ tenant: null, profile: fallbackProfile, loading: true, reload: () => {} });
