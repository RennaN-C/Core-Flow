const moduleOptions = {
  crm: ['Cadastro completo', 'Historico de relacionamento', 'Busca e segmentacao'],
  finance: ['PIX demonstrativo', 'Cobrancas avulsas', 'Recorrencias', 'Controle de pendencias'],
  sales: ['Pedidos', 'Reservas', 'Oportunidades', 'Acompanhamento comercial'],
  inventory: ['Catalogo', 'Disponibilidade', 'Reposicao', 'Itens mais procurados'],
  attendance: ['Presencas', 'Engajamento', 'Alertas de ausencia', 'Historico'],
  plans: ['Planos', 'Renovacoes', 'Vencimentos', 'Beneficios'],
  assessments: ['Avaliacoes', 'Objetivos', 'Evolucao', 'Retornos'],
  appointments: ['Agenda', 'Confirmacoes', 'Retornos', 'Lista de espera'],
  services: ['Catalogo de servicos', 'Valores', 'Duracao', 'Historico'],
  followups: ['Pendencias', 'Retornos', 'Lembretes', 'Acompanhamento'],
  professionals: ['Equipe', 'Especialidades', 'Disponibilidade', 'Preferencias'],
  packages: ['Pacotes', 'Sessoes', 'Validade', 'Renovacoes'],
  community: ['Atividades', 'Participacao', 'Comunicados', 'Calendario'],
  groups: ['Grupos', 'Responsaveis', 'Participantes', 'Encontros'],
  events: ['Eventos', 'Inscricoes', 'Capacidade', 'Confirmacoes'],
  projects: ['Demandas', 'Etapas', 'Prazos', 'Entregas'],
  proposals: ['Propostas', 'Valores', 'Aprovacoes', 'Conversoes'],
  contracts: ['Contratos', 'Vigencias', 'Parcelas', 'Renovacoes'],
  orders: ['Pedidos', 'Status', 'Entrega', 'Historico'],
  reservations: ['Reservas', 'Horarios', 'Capacidade', 'Confirmacoes'],
  loyalty: ['Beneficios', 'Recorrencia', 'Preferencias', 'Campanhas'],
  classes: ['Turmas', 'Cursos', 'Vagas', 'Calendario'],
  enrollments: ['Matriculas', 'Responsaveis', 'Renovacoes', 'Situacao'],
  pets: ['Pets', 'Tutores', 'Historico', 'Observacoes'],
  vehicles: ['Veiculos', 'Placas', 'Historico', 'Revisoes'],
  workorders: ['Ordens de servico', 'Etapas', 'Pecas', 'Entregas'],
  maintenance: ['Revisoes', 'Alertas', 'Quilometragem', 'Retornos'],
};

const profiles = {
  varejo: {
    id: 'varejo',
    name: 'Varejo e comercio',
    baseBusinessType: 'varejo',
    customerLabel: 'Clientes',
    customerSingular: 'Cliente',
    headline: 'Controle vendas, relacionamento e recebimentos em um unico fluxo.',
    customerFields: [
      { id: 'segmento', label: 'Segmento de interesse', placeholder: 'Ex: roupas, acessorios' },
      { id: 'preferencias', label: 'Preferencias', placeholder: 'Produtos e preferencias do cliente' },
      { id: 'canal_preferido', label: 'Canal preferido', placeholder: 'Ex: WhatsApp, e-mail, telefone' },
    ],
    suggestedCharges: ['Venda de produtos', 'Pedido reservado', 'Parcela de compra'],
    modules: [
      ['crm', 'Relacionamento', 'Historico e preferencias dos clientes'],
      ['finance', 'Cobrancas', 'PIX, recorrencias e acompanhamento financeiro'],
      ['sales', 'Vendas', 'Pedidos, reservas e oportunidades comerciais'],
      ['inventory', 'Catalogo e estoque', 'Disponibilidade, reposicao e interesse dos clientes'],
      ['loyalty', 'Fidelizacao', 'Beneficios, campanhas e relacionamento recorrente'],
    ],
    operationalFeatures: ['Pedidos em acompanhamento', 'Clientes recorrentes', 'Produtos mais procurados', 'Itens para reposicao', 'Campanhas de fidelizacao'],
  },
  academia: {
    id: 'academia',
    name: 'Academia e fitness',
    baseBusinessType: 'academia',
    customerLabel: 'Alunos',
    customerSingular: 'Aluno',
    headline: 'Acompanhe alunos, planos e mensalidades com clareza.',
    customerFields: [
      { id: 'plano', label: 'Plano contratado', placeholder: 'Ex: mensal, trimestral' },
      { id: 'objetivo', label: 'Objetivo', placeholder: 'Ex: condicionamento, hipertrofia' },
      { id: 'matricula', label: 'Matricula', placeholder: 'Codigo interno do aluno' },
    ],
    suggestedCharges: ['Mensalidade', 'Plano trimestral', 'Aula especial', 'Avaliacao fisica'],
    modules: [
      ['crm', 'Alunos', 'Cadastro e acompanhamento dos alunos'],
      ['finance', 'Mensalidades', 'PIX e recorrencias dos planos'],
      ['attendance', 'Frequencia', 'Acompanhamento de presenca e engajamento'],
      ['plans', 'Planos', 'Contratos, renovacoes e vencimentos'],
      ['assessments', 'Avaliacoes', 'Objetivos, evolucao e retornos dos alunos'],
    ],
    operationalFeatures: ['Planos ativos', 'Alunos em renovacao', 'Frequencia da semana', 'Avaliacoes pendentes', 'Alunos com baixa frequencia'],
  },
  clinica: {
    id: 'clinica',
    name: 'Clinica e consultorio',
    baseBusinessType: 'clinica',
    customerLabel: 'Pacientes',
    customerSingular: 'Paciente',
    headline: 'Organize pacientes, atendimentos e cobrancas da clinica.',
    customerFields: [
      { id: 'convenio', label: 'Convenio', placeholder: 'Convenio ou atendimento particular' },
      { id: 'observacoes', label: 'Observacoes administrativas', placeholder: 'Informacoes administrativas, sem dados clinicos sensiveis' },
      { id: 'responsavel_financeiro', label: 'Responsavel financeiro', placeholder: 'Nome do responsavel financeiro' },
    ],
    suggestedCharges: ['Consulta', 'Retorno', 'Procedimento', 'Pacote de atendimento'],
    modules: [
      ['crm', 'Pacientes', 'Relacionamento administrativo com pacientes'],
      ['finance', 'Recebimentos', 'PIX e cobrancas por atendimento'],
      ['appointments', 'Agenda', 'Organizacao de consultas e retornos'],
      ['services', 'Servicos', 'Procedimentos, valores e duracao dos atendimentos'],
      ['followups', 'Retornos', 'Pendencias administrativas e lembretes'],
    ],
    operationalFeatures: ['Consultas agendadas', 'Retornos pendentes', 'Recebimentos por atendimento', 'Agenda com confirmacao', 'Procedimentos mais realizados'],
  },
  barbearia: {
    id: 'barbearia',
    name: 'Barbearia e salao',
    baseBusinessType: 'barbearia',
    customerLabel: 'Clientes',
    customerSingular: 'Cliente',
    headline: 'Mantenha clientes proximos e servicos recorrentes organizados.',
    customerFields: [
      { id: 'servico_preferido', label: 'Servico preferido', placeholder: 'Ex: corte, barba, combo' },
      { id: 'profissional_preferido', label: 'Profissional preferido', placeholder: 'Nome do profissional' },
      { id: 'frequencia_retorno', label: 'Frequencia de retorno', placeholder: 'Ex: a cada 15 dias' },
    ],
    suggestedCharges: ['Corte', 'Barba', 'Combo corte e barba', 'Pacote mensal'],
    modules: [
      ['crm', 'Clientes', 'Preferencias e relacionamento'],
      ['finance', 'Recebimentos', 'Cobrancas avulsas e pacotes'],
      ['appointments', 'Agenda', 'Horarios e retorno de clientes'],
      ['professionals', 'Profissionais', 'Equipe, especialidades e disponibilidade'],
      ['packages', 'Pacotes', 'Servicos recorrentes, sessoes e renovacoes'],
    ],
    operationalFeatures: ['Agenda do dia', 'Pacotes ativos', 'Clientes para retorno', 'Horarios disponiveis', 'Servicos mais solicitados'],
  },
  igreja: {
    id: 'igreja',
    name: 'Igreja e comunidade',
    baseBusinessType: 'igreja',
    customerLabel: 'Membros',
    customerSingular: 'Membro',
    headline: 'Organize membros, contribuicoes e atividades da comunidade.',
    customerFields: [
      { id: 'ministerio', label: 'Ministerio ou grupo', placeholder: 'Grupo do membro' },
      { id: 'data_ingresso', label: 'Data de ingresso', type: 'date' },
      { id: 'responsavel_grupo', label: 'Responsavel de referencia', placeholder: 'Nome do responsavel ou lider' },
    ],
    suggestedCharges: ['Contribuicao', 'Evento', 'Campanha', 'Inscricao'],
    modules: [
      ['crm', 'Membros', 'Cadastro e relacionamento da comunidade'],
      ['finance', 'Contribuicoes', 'Registro de contribuicoes e campanhas'],
      ['community', 'Atividades', 'Grupos, eventos e participacao'],
      ['groups', 'Grupos', 'Ministerios, liderancas e participantes'],
      ['events', 'Eventos', 'Inscricoes, capacidade e confirmacoes'],
    ],
    operationalFeatures: ['Membros ativos', 'Contribuicoes do mes', 'Atividades em andamento', 'Eventos proximos', 'Grupos com novos participantes'],
  },
  servicos: {
    id: 'servicos',
    name: 'Prestacao de servicos',
    baseBusinessType: 'varejo',
    customerLabel: 'Clientes',
    customerSingular: 'Cliente',
    headline: 'Centralize clientes, propostas e cobrancas dos seus servicos.',
    customerFields: [
      { id: 'servico_interesse', label: 'Servico de interesse', placeholder: 'Servico contratado ou desejado' },
      { id: 'origem', label: 'Origem do contato', placeholder: 'Ex: indicacao, site, rede social' },
      { id: 'responsavel_atendimento', label: 'Responsavel pelo atendimento', placeholder: 'Pessoa responsavel pelo cliente' },
    ],
    suggestedCharges: ['Servico realizado', 'Sinal de projeto', 'Parcela de contrato', 'Mensalidade de suporte'],
    modules: [
      ['crm', 'Clientes', 'Base comercial e historico'],
      ['finance', 'Cobrancas', 'PIX, parcelas e recorrencias'],
      ['projects', 'Servicos', 'Demandas, propostas e entregas'],
      ['proposals', 'Propostas', 'Orcamentos, aprovacoes e conversoes'],
      ['contracts', 'Contratos', 'Vigencias, parcelas e renovacoes'],
    ],
    operationalFeatures: ['Servicos em andamento', 'Propostas abertas', 'Contratos recorrentes', 'Entregas da semana', 'Clientes aguardando retorno'],
  },
  restaurante: {
    id: 'restaurante',
    name: 'Restaurante e alimentacao',
    baseBusinessType: 'varejo',
    customerLabel: 'Clientes',
    customerSingular: 'Cliente',
    headline: 'Aproxime clientes e organize pedidos, eventos e recebimentos.',
    customerFields: [
      { id: 'preferencias', label: 'Preferencias', placeholder: 'Preferencias do cliente' },
      { id: 'restricoes', label: 'Restricoes informadas', placeholder: 'Observacoes fornecidas pelo cliente' },
      { id: 'canal_pedido', label: 'Canal de pedido preferido', placeholder: 'Ex: balcao, telefone, delivery' },
    ],
    suggestedCharges: ['Pedido', 'Reserva de evento', 'Buffet', 'Clube de vantagens'],
    modules: [
      ['crm', 'Clientes', 'Relacionamento e preferencias'],
      ['finance', 'Recebimentos', 'Pedidos, eventos e recorrencias'],
      ['orders', 'Pedidos', 'Acompanhamento de pedidos e reservas'],
      ['reservations', 'Reservas', 'Mesas, eventos e confirmacoes'],
      ['loyalty', 'Fidelizacao', 'Beneficios e campanhas para clientes recorrentes'],
    ],
    operationalFeatures: ['Pedidos em aberto', 'Reservas proximas', 'Clientes recorrentes', 'Eventos confirmados', 'Preferencias mais recorrentes'],
  },
  escola: {
    id: 'escola',
    name: 'Escola e cursos',
    baseBusinessType: 'clinica',
    customerLabel: 'Alunos',
    customerSingular: 'Aluno',
    headline: 'Gerencie alunos, turmas e mensalidades de forma simples.',
    customerFields: [
      { id: 'matricula', label: 'Matricula', placeholder: 'Codigo interno do aluno' },
      { id: 'turma', label: 'Turma ou curso', placeholder: 'Turma atual' },
      { id: 'responsavel', label: 'Responsavel', placeholder: 'Nome do responsavel financeiro' },
    ],
    suggestedCharges: ['Mensalidade', 'Matricula', 'Material didatico', 'Curso complementar'],
    modules: [
      ['crm', 'Alunos', 'Cadastros e responsaveis'],
      ['finance', 'Mensalidades', 'PIX e cobrancas recorrentes'],
      ['classes', 'Turmas', 'Cursos, turmas e acompanhamento'],
      ['enrollments', 'Matriculas', 'Situacao, responsaveis e renovacoes'],
      ['attendance', 'Frequencia', 'Presencas, ausencias e engajamento'],
    ],
    operationalFeatures: ['Alunos ativos', 'Turmas em andamento', 'Mensalidades pendentes', 'Matriculas para renovacao', 'Frequencia por turma'],
  },
  petshop: {
    id: 'petshop',
    name: 'Pet shop e veterinaria',
    baseBusinessType: 'varejo',
    customerLabel: 'Tutores',
    customerSingular: 'Tutor',
    headline: 'Conecte tutores, pets, servicos e recebimentos.',
    customerFields: [
      { id: 'pet_nome', label: 'Nome do pet', placeholder: 'Nome do animal' },
      { id: 'pet_especie', label: 'Especie', placeholder: 'Ex: cachorro, gato' },
      { id: 'pet_raca', label: 'Raca', placeholder: 'Raca do pet' },
    ],
    suggestedCharges: ['Banho e tosa', 'Consulta veterinaria', 'Vacina', 'Pacote mensal'],
    modules: [
      ['crm', 'Tutores e pets', 'Cadastro de tutores e informacoes do pet'],
      ['finance', 'Recebimentos', 'PIX e pacotes recorrentes'],
      ['appointments', 'Agenda', 'Servicos e atendimentos agendados'],
      ['pets', 'Pets', 'Historico, preferencias e observacoes dos animais'],
      ['packages', 'Pacotes', 'Banhos, sessoes, validade e renovacoes'],
    ],
    operationalFeatures: ['Servicos agendados', 'Pacotes ativos', 'Retornos recomendados', 'Vacinas informadas', 'Tutores para retorno'],
  },
  oficina: {
    id: 'oficina',
    name: 'Oficina e auto center',
    baseBusinessType: 'varejo',
    customerLabel: 'Clientes',
    customerSingular: 'Cliente',
    headline: 'Organize clientes, veiculos, servicos e cobrancas.',
    customerFields: [
      { id: 'veiculo', label: 'Veiculo', placeholder: 'Marca e modelo' },
      { id: 'placa', label: 'Placa', placeholder: 'Placa do veiculo' },
      { id: 'ano', label: 'Ano', placeholder: 'Ano do veiculo' },
    ],
    suggestedCharges: ['Revisao', 'Manutencao', 'Peca e servico', 'Sinal de servico'],
    modules: [
      ['crm', 'Clientes e veiculos', 'Cadastro de clientes e seus veiculos'],
      ['finance', 'Cobrancas', 'PIX, sinais e parcelas'],
      ['workorders', 'Ordens de servico', 'Acompanhamento dos servicos da oficina'],
      ['vehicles', 'Veiculos', 'Placas, historico e revisoes'],
      ['maintenance', 'Manutencoes', 'Alertas, quilometragem e retornos recomendados'],
    ],
    operationalFeatures: ['Ordens em andamento', 'Veiculos para entrega', 'Revisoes recomendadas', 'Pecas em acompanhamento', 'Clientes aguardando orcamento'],
  },
};

const normalizeModules = (profile, enabledModules) => {
  const available = profile.modules.map(([id]) => id);
  if (!Array.isArray(enabledModules)) return available;
  return enabledModules.filter((id) => available.includes(id));
};

const resolveProfile = ({ profileId, businessType, enabledModules } = {}) => {
  const profile = profiles[profileId] || profiles[businessType] || profiles.varejo;
  return {
    ...profile,
    modules: profile.modules.map(([id, label, description]) => ({ id, label, description, options: moduleOptions[id] || [] })),
    enabledModules: normalizeModules(profile, enabledModules),
  };
};

const listProfiles = () => Object.values(profiles).map((profile) => resolveProfile({ profileId: profile.id }));

const createLicenseSettings = (profile) => ({
  profile_id: profile.id,
  enabled_modules: profile.enabledModules,
  issued_at: new Date().toISOString(),
});

const getLicenseSettings = ({ settings = {}, businessType } = {}) => {
  if (settings.license) return settings.license;
  return createLicenseSettings(resolveProfile({
    profileId: settings.profile_id,
    businessType,
    enabledModules: settings.enabled_modules,
  }));
};

const resolveLicensedProfile = ({ settings = {}, businessType } = {}) => {
  const license = getLicenseSettings({ settings, businessType });
  return resolveProfile({
    profileId: license.profile_id,
    businessType,
    enabledModules: license.enabled_modules,
  });
};

module.exports = { createLicenseSettings, getLicenseSettings, listProfiles, resolveLicensedProfile, resolveProfile };
