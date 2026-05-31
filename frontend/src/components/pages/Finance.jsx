import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clipboard, CreditCard, PauseCircle, PlayCircle, RefreshCw, Search, WalletCards, XCircle } from 'lucide-react';
import resourceApi from '../../services/resourceApi';
import { useTenantProfile } from '../../hooks/useTenantProfile';

const dueDateFromNow = (days = 7) => {
  const date = new Date();
  date.setDate(date.getDate() + Number(days || 7));
  return date.toISOString().slice(0, 10);
};
const buildDefaults = (tenant) => {
  const preferences = tenant?.settings?.system?.finance || {};
  return { dueDate: dueDateFromNow(preferences.default_due_days), billingType: preferences.default_billing_type || 'PIX' };
};
const buildEmpty = () => ({ personId: '', amount: '', dueDate: '', description: '', billingType: '', recurring: false, cycle: 'MONTHLY' });
const money = (value) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const statuses = { PENDING: 'Pendente', PAID: 'Pago', OVERDUE: 'Vencido', CANCELED: 'Cancelado' };

const Finance = () => {
  const { tenant, profile } = useTenantProfile();
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(buildEmpty);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const loadData = () => Promise.all([resourceApi.get('/persons'), resourceApi.get('/finance/invoices'), resourceApi.get('/finance/invoices/subscriptions')])
    .then(([people, bills, subscriptions]) => { setCustomers(people.data); setInvoices(bills.data); setPlans(subscriptions.data); })
    .catch((err) => setError(err.response?.data?.error || 'Erro ao carregar financeiro.'));
  useEffect(() => { loadData(); }, []);
  const filtered = useMemo(() => invoices.filter((invoice) => (statusFilter === 'ALL' || invoice.status === statusFilter) && `${invoice.Person?.name || ''} ${invoice.description}`.toLowerCase().includes(search.toLowerCase())), [invoices, search, statusFilter]);
  const submit = async (event) => {
    event.preventDefault();
    setError(''); setMessage('');
    try {
      const endpoint = form.recurring ? '/finance/invoices/subscriptions' : '/finance/invoices';
      const normalizedForm = { ...form, ...buildDefaults(tenant), dueDate: form.dueDate || buildDefaults(tenant).dueDate, billingType: form.billingType || buildDefaults(tenant).billingType };
      await resourceApi.post(endpoint, form.recurring ? { ...normalizedForm, nextDueDate: normalizedForm.dueDate } : normalizedForm);
      setForm(buildEmpty());
      setMessage(form.recurring ? 'Cobranca automatica criada.' : 'Cobranca gerada com sucesso.');
      loadData();
    } catch (err) { setError(err.response?.data?.error || 'Erro ao gerar cobranca.'); }
  };
  const payDemo = async (gatewayPaymentId) => {
    try { await resourceApi.post(`/finance/invoices/${gatewayPaymentId}/demo-payment`); setMessage('Pagamento demonstrativo confirmado.'); loadData(); } catch (err) { setError(err.response?.data?.error || 'Erro ao simular pagamento.'); }
  };
  const cancelInvoice = async (id) => {
    if (!window.confirm('Cancelar esta cobranca pendente?')) return;
    try { await resourceApi.put(`/finance/invoices/${id}/cancel`); setMessage('Cobranca cancelada.'); loadData(); } catch (err) { setError(err.response?.data?.error || 'Erro ao cancelar cobranca.'); }
  };
  const setPlanStatus = async (id, status) => {
    try { await resourceApi.put(`/finance/invoices/subscriptions/${id}/status`, { status }); setMessage(status === 'ACTIVE' ? 'Recorrencia reativada.' : 'Recorrencia pausada.'); loadData(); } catch (err) { setError(err.response?.data?.error || 'Erro ao atualizar recorrencia.'); }
  };
  const copyPix = async (invoice) => {
    await navigator.clipboard.writeText(invoice.pix_payload);
    setCopied(invoice.id);
    setTimeout(() => setCopied(''), 1800);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="surface-card">
        <div className="mb-5 flex items-start gap-3"><div className="rounded-xl bg-violet-500/15 p-3 text-violet-300"><WalletCards size={20} /></div><div><h2 className="text-xl font-bold text-white">Nova cobranca</h2><p className="mt-1 text-sm text-slate-400">Gere um PIX ou programe recorrencias para {profile.name.toLowerCase()}.</p></div></div>
        {message && <p className="mb-4 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-300">{message}</p>}{error && <p className="mb-4 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
        <div className="mb-4 flex flex-wrap gap-2">{profile.suggestedCharges.map((description) => <button key={description} type="button" onClick={() => setForm({ ...form, description })} className="info-chip transition-colors hover:border-violet-400/40 hover:text-violet-200">{description}</button>)}</div>
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
          <select required value={form.personId} onChange={(event) => setForm({ ...form, personId: event.target.value })} className="professional-input"><option value="">Selecione: {profile.customerLabel}</option>{customers.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select>
          <input required type="number" min="0.01" step="0.01" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} placeholder="Valor da cobranca" className="professional-input" />
          <input required type="date" value={form.dueDate || buildDefaults(tenant).dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} className="professional-input" />
          <input required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Descricao" className="professional-input" />
          <select value={form.billingType || buildDefaults(tenant).billingType} onChange={(event) => setForm({ ...form, billingType: event.target.value })} className="professional-input"><option value="PIX">PIX</option><option value="BOLETO">Boleto</option><option value="CREDIT_CARD">Cartao de credito</option></select>
          <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={form.recurring} onChange={(event) => setForm({ ...form, recurring: event.target.checked })} className="accent-violet-500" /> Cobranca automatica recorrente</label>
          {form.recurring && <select value={form.cycle} onChange={(event) => setForm({ ...form, cycle: event.target.value })} className="professional-input"><option value="MONTHLY">Mensal</option><option value="WEEKLY">Semanal</option><option value="BIWEEKLY">Quinzenal</option><option value="QUARTERLY">Trimestral</option><option value="SEMIANNUALLY">Semestral</option><option value="YEARLY">Anual</option></select>}
          <button className="primary-action md:col-span-2">{form.recurring ? 'Criar cobranca automatica' : 'Gerar cobranca'}</button>
        </form>
      </section>

      <section className="surface-card">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><CreditCard className="text-violet-300" size={18} /><h3 className="font-semibold text-white">Cobrancas emitidas</h3></div><div className="flex flex-1 flex-wrap justify-end gap-2"><label className="relative min-w-52 flex-1 sm:max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar cobranca" className="professional-input pl-9" /></label><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="professional-input max-w-40"><option value="ALL">Todos</option>{Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div></div>
        <div className="space-y-3">{filtered.length === 0 ? <p className="text-sm text-slate-500">Nenhuma cobranca encontrada.</p> : filtered.map((invoice) => <article key={invoice.id} className="invoice-card"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-medium text-white">{invoice.Person?.name || profile.customerSingular}</p><p className="mt-1 text-sm text-slate-400">{invoice.description}</p></div><div className="text-right"><p className="font-semibold text-white">{money(invoice.amount)}</p><span className={`status-badge status-badge--${invoice.status.toLowerCase()}`}>{statuses[invoice.status] || invoice.status}</span></div></div>{invoice.pix_payload && <div className="mt-3 flex flex-col gap-2 rounded-xl bg-slate-950/30 p-3 sm:flex-row sm:items-center sm:justify-between"><code className="break-all text-xs text-slate-400">{invoice.pix_payload}</code><button onClick={() => copyPix(invoice)} className="secondary-action">{copied === invoice.id ? <CheckCircle2 size={15} /> : <Clipboard size={15} />}{copied === invoice.id ? 'Copiado' : 'Copiar PIX'}</button></div>}<div className="mt-3 flex flex-wrap gap-2">{invoice.payment_url?.startsWith('http') && <a className="secondary-action" href={invoice.payment_url} target="_blank" rel="noreferrer">Abrir link</a>}{invoice.gateway_payment_id?.startsWith('demo_payment_') && invoice.status === 'PENDING' && <button onClick={() => payDemo(invoice.gateway_payment_id)} className="secondary-action"><CheckCircle2 size={15} /> Simular pagamento</button>}{invoice.status === 'PENDING' && <button onClick={() => cancelInvoice(invoice.id)} className="danger-action"><XCircle size={15} /> Cancelar</button>}</div></article>)}</div>
      </section>

      <section className="surface-card">
        <div className="mb-3 flex items-center gap-2"><RefreshCw className="text-violet-300" size={17} /><h3 className="font-semibold text-white">Cobrancas automaticas</h3></div>
        <div className="space-y-3">{plans.length === 0 ? <p className="text-sm text-slate-500">Nenhum plano recorrente.</p> : plans.map((plan) => <article key={plan.id} className="invoice-card flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-medium text-white">{plan.Person?.name} - {plan.description}</p><p className="mt-1 text-xs text-slate-500">{money(plan.amount)} | {plan.cycle} | {plan.status}</p></div><button onClick={() => setPlanStatus(plan.id, plan.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')} className="secondary-action">{plan.status === 'ACTIVE' ? <PauseCircle size={15} /> : <PlayCircle size={15} />}{plan.status === 'ACTIVE' ? 'Pausar' : 'Reativar'}</button></article>)}</div>
      </section>
    </div>
  );
};

export default Finance;
