import { useState } from 'react';
import { BellRing, Building2, CheckCircle2, CreditCard, KeyRound, Settings2 } from 'lucide-react';
import resourceApi from '../../services/resourceApi';
import { useTenantProfile } from '../../hooks/useTenantProfile';

const initialForm = {
  name: '',
  document: '',
  company_phone: '',
  timezone: 'America/Sao_Paulo',
  currency: 'BRL',
  date_format: 'DD/MM/YYYY',
  default_due_days: 7,
  default_billing_type: 'PIX',
  overdue_alerts: true,
  billing_updates: true,
  audit_alerts: true,
  license_alerts: true,
  weekly_summary: true,
  compact_mode: false,
};

const formFromTenant = (tenant) => {
  const system = tenant.settings?.system || {};
  return {
    ...initialForm,
    name: tenant.name || '',
    document: tenant.document || '',
    ...system,
    ...(system.finance || {}),
    ...(system.notifications || {}),
    ...(system.interface || {}),
  };
};

const Settings = () => {
  const context = useTenantProfile();
  if (!context.tenant) return <p className="text-slate-400">Carregando configuracoes...</p>;
  return <SettingsForm key={context.tenant.id} {...context} />;
};

const SettingsForm = ({ tenant, profile, reload }) => {
  const [form, setForm] = useState(() => formFromTenant(tenant));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const change = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const submit = async (event) => {
    event.preventDefault();
    try {
      await resourceApi.put('/tenant', {
        name: form.name,
        document: form.document,
        system: {
          company_phone: form.company_phone,
          timezone: form.timezone,
          currency: form.currency,
          date_format: form.date_format,
          finance: {
            default_due_days: form.default_due_days,
            default_billing_type: form.default_billing_type,
            overdue_alerts: form.overdue_alerts,
          },
          notifications: {
            billing_updates: form.billing_updates,
            audit_alerts: form.audit_alerts,
            license_alerts: form.license_alerts,
            weekly_summary: form.weekly_summary,
          },
          interface: { compact_mode: form.compact_mode },
        },
      });
      await reload();
      setMessage('Configuracoes administrativas salvas.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar configuracoes.');
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="surface-card">
        <div className="mb-5 flex items-start gap-3"><div className="rounded-xl bg-violet-500/15 p-3 text-violet-300"><Settings2 size={20} /></div><div><h2 className="text-xl font-bold text-white">Configuracoes do sistema</h2><p className="mt-1 text-sm text-slate-400">Defina dados administrativos, padroes financeiros e alertas do ambiente.</p></div></div>
        {message && <p className="mb-4 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-300">{message}</p>}{error && <p className="mb-4 text-sm text-red-400">{error}</p>}
        <form onSubmit={submit} className="space-y-6">
          <SettingsGroup Icon={Building2} title="Empresa" description="Informacoes administrativas exibidas no ambiente.">
            <Field label="Nome da empresa"><input required value={form.name} onChange={(event) => change('name', event.target.value)} className="professional-input" /></Field>
            <Field label="CPF ou CNPJ"><input value={form.document} onChange={(event) => change('document', event.target.value)} className="professional-input" /></Field>
            <Field label="Telefone"><input value={form.company_phone} onChange={(event) => change('company_phone', event.target.value)} className="professional-input" /></Field>
            <Field label="Fuso horario"><select value={form.timezone} onChange={(event) => change('timezone', event.target.value)} className="professional-input"><option value="America/Sao_Paulo">Sao Paulo</option><option value="America/Manaus">Manaus</option><option value="America/Recife">Recife</option><option value="America/Fortaleza">Fortaleza</option></select></Field>
            <Field label="Moeda"><select value={form.currency} onChange={(event) => change('currency', event.target.value)} className="professional-input"><option value="BRL">Real brasileiro</option><option value="USD">Dolar americano</option><option value="EUR">Euro</option></select></Field>
            <Field label="Formato de data"><select value={form.date_format} onChange={(event) => change('date_format', event.target.value)} className="professional-input"><option value="DD/MM/YYYY">DD/MM/AAAA</option><option value="MM/DD/YYYY">MM/DD/AAAA</option><option value="YYYY-MM-DD">AAAA-MM-DD</option></select></Field>
          </SettingsGroup>

          <SettingsGroup Icon={CreditCard} title="Financeiro" description="Padroes usados ao abrir uma nova cobranca.">
            <Field label="Vencimento padrao"><input type="number" min="1" max="90" value={form.default_due_days} onChange={(event) => change('default_due_days', event.target.value)} className="professional-input" /></Field>
            <Field label="Meio de cobranca padrao"><select value={form.default_billing_type} onChange={(event) => change('default_billing_type', event.target.value)} className="professional-input"><option value="PIX">PIX</option><option value="BOLETO">Boleto</option><option value="CREDIT_CARD">Cartao de credito</option></select></Field>
            <Toggle label="Alertas de atraso" description="Destacar cobrancas vencidas para acompanhamento." checked={form.overdue_alerts} onChange={(value) => change('overdue_alerts', value)} />
          </SettingsGroup>

          <SettingsGroup Icon={BellRing} title="Alertas administrativos" description="Escolha os eventos acompanhados pela gestao.">
            <Toggle label="Atualizacoes financeiras" description="Acompanhar alteracoes em cobrancas e pagamentos." checked={form.billing_updates} onChange={(value) => change('billing_updates', value)} />
            <Toggle label="Alertas de auditoria" description="Sinalizar acoes administrativas importantes." checked={form.audit_alerts} onChange={(value) => change('audit_alerts', value)} />
            <Toggle label="Avisos da licenca" description="Receber lembretes relacionados ao ambiente licenciado." checked={form.license_alerts} onChange={(value) => change('license_alerts', value)} />
            <Toggle label="Resumo semanal" description="Preparar um resumo recorrente dos indicadores." checked={form.weekly_summary} onChange={(value) => change('weekly_summary', value)} />
            <Toggle label="Interface compacta" description="Preferir maior densidade de informacoes nas telas." checked={form.compact_mode} onChange={(value) => change('compact_mode', value)} />
          </SettingsGroup>
          <button className="primary-action w-full">Salvar configuracoes</button>
        </form>
      </section>

      <section className="surface-card">
        <div className="mb-4 flex items-start gap-3"><div className="rounded-xl bg-violet-500/15 p-3 text-violet-300"><KeyRound size={19} /></div><div><h3 className="font-semibold text-white">Perfil vinculado a licenca</h3><p className="mt-1 text-sm text-slate-400">O nicho e os modulos sao definidos no cadastro e permanecem protegidos nesta licenca.</p></div></div>
        <div className="mb-4 rounded-xl border border-violet-400/15 bg-violet-500/5 p-4"><p className="font-semibold text-white">{profile.name}</p><p className="mt-1 text-sm text-slate-400">{profile.headline}</p></div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{profile.modules.map((module) => <article key={module.id} className="niche-card niche-card--active"><div className="flex items-center justify-between gap-2"><p className="font-medium text-white">{module.label}</p><CheckCircle2 className="text-emerald-400" size={17} /></div><p className="mt-2 text-sm text-slate-400">{module.description}</p><div className="mt-3 flex flex-wrap gap-1.5">{module.options.map((option) => <span key={option} className="info-chip">{option}</span>)}</div></article>)}</div>
      </section>
    </div>
  );
};

const SettingsGroup = ({ Icon, title, description, children }) => <section className="rounded-xl border border-violet-400/10 bg-slate-950/10 p-4"><div className="mb-4 flex items-center gap-2"><Icon className="text-violet-300" size={18} /><div><h3 className="font-semibold text-white">{title}</h3><p className="text-xs text-slate-500">{description}</p></div></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{children}</div></section>;
const Field = ({ label, children }) => <label className="space-y-1"><span className="field-label">{label}</span>{children}</label>;
const Toggle = ({ label, description, checked, onChange }) => <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-violet-400/10 bg-slate-950/10 p-3"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-1 accent-violet-500" /><span><span className="block text-sm font-medium text-white">{label}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span></span></label>;

export default Settings;
