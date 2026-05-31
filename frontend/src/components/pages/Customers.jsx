import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Search, Trash2, UserRound } from 'lucide-react';
import resourceApi from '../../services/resourceApi';
import { useTenantProfile } from '../../hooks/useTenantProfile';

const empty = { name: '', document: '', email: '', phone: '', metadata: {} };

const Customers = () => {
  const { profile } = useTenantProfile();
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const role = JSON.parse(localStorage.getItem('@CoreFlow:user') || '{}').role;
  const loadData = useCallback(() => resourceApi.get('/persons').then(({ data }) => setCustomers(data)).catch((err) => setError(err.response?.data?.error || `Erro ao carregar ${profile.customerLabel.toLowerCase()}.`)), [profile.customerLabel]);
  useEffect(() => { loadData(); }, [loadData]);

  const filtered = useMemo(() => customers.filter((customer) => `${customer.name} ${customer.document || ''} ${customer.email || ''} ${customer.phone || ''}`.toLowerCase().includes(search.toLowerCase())), [customers, search]);
  const updateMetadata = (id, value) => setForm({ ...form, metadata: { ...form.metadata, [id]: value } });
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      if (editing) await resourceApi.put(`/persons/${editing}`, form);
      else await resourceApi.post('/persons', form);
      setMessage(editing ? `${profile.customerSingular} atualizado com sucesso.` : `${profile.customerSingular} cadastrado com sucesso.`);
      setForm(empty);
      setEditing(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || `Erro ao cadastrar ${profile.customerSingular.toLowerCase()}.`);
    }
  };
  const edit = (customer) => {
    setEditing(customer.id);
    setForm({ name: customer.name || '', document: customer.document || '', email: customer.email || '', phone: customer.phone || '', metadata: customer.metadata || {} });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const remove = async (id) => {
    if (!window.confirm(`Excluir este ${profile.customerSingular.toLowerCase()}?`)) return;
    try { await resourceApi.delete(`/persons/${id}`); setMessage(`${profile.customerSingular} excluido.`); loadData(); } catch (err) { setError(err.response?.data?.error || 'Erro ao excluir cadastro.'); }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="surface-card">
        <div className="mb-5 flex items-start gap-3"><div className="rounded-xl bg-violet-500/15 p-3 text-violet-300"><UserRound size={20} /></div><div><h2 className="text-xl font-bold text-white">{profile.customerLabel}</h2><p className="mt-1 text-sm text-slate-400">Cadastre contatos e mantenha os dados relevantes para {profile.name.toLowerCase()}.</p></div></div>
        {message && <p className="mb-4 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-300">{message}</p>}{error && <p className="mb-4 text-sm text-red-400">{error}</p>}
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
          <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Nome completo" className="professional-input" />
          <input value={form.document} onChange={(event) => setForm({ ...form, document: event.target.value })} placeholder="CPF ou CNPJ" className="professional-input" />
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="E-mail" className="professional-input" />
          <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Telefone" className="professional-input" />
          {profile.customerFields.map((field) => <label key={field.id} className="space-y-1"><span className="field-label">{field.label}</span><input type={field.type || 'text'} value={form.metadata[field.id] || ''} onChange={(event) => updateMetadata(field.id, event.target.value)} placeholder={field.placeholder} className="professional-input" /></label>)}
          <div className="flex flex-wrap gap-2 md:col-span-2"><button className="primary-action flex-1">{editing ? `Salvar ${profile.customerSingular.toLowerCase()}` : `Cadastrar ${profile.customerSingular.toLowerCase()}`}</button>{editing && <button type="button" onClick={() => { setEditing(null); setForm(empty); }} className="secondary-action">Cancelar edicao</button>}</div>
        </form>
      </section>

      <section className="surface-card">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold text-white">{profile.customerLabel} cadastrados</h3><label className="relative min-w-64 flex-1 sm:max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar cadastro" className="professional-input pl-9" /></label></div>
        <div className="space-y-3">
          {filtered.length === 0 ? <p className="text-sm text-slate-500">Nenhum cadastro encontrado.</p> : filtered.map((customer) => <article key={customer.id} className="invoice-card"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-medium text-white">{customer.name}</p><p className="mt-1 text-sm text-slate-500">{customer.document || 'Documento nao informado'} | {customer.email || 'E-mail nao informado'} | {customer.phone || 'Telefone nao informado'}</p>{profile.customerFields.some((field) => customer.metadata?.[field.id]) && <div className="mt-3 flex flex-wrap gap-2">{profile.customerFields.filter((field) => customer.metadata?.[field.id]).map((field) => <span key={field.id} className="info-chip">{field.label}: {customer.metadata[field.id]}</span>)}</div>}</div>{role !== 'staff' && <div className="flex gap-2"><button onClick={() => edit(customer)} className="secondary-action"><Pencil size={14} /> Editar</button>{role === 'admin' && <button onClick={() => remove(customer.id)} className="danger-action"><Trash2 size={14} /> Excluir</button>}</div>}</div></article>)}
        </div>
      </section>
      <p className="flex items-center gap-2 text-xs text-slate-500"><Plus size={14} /> Campos adicionais sao definidos pelo perfil {profile.name}.</p>
    </div>
  );
};

export default Customers;
