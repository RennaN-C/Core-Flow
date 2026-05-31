import { useEffect, useMemo, useState } from 'react';
import { Search, ShieldCheck, Trash2, UserCog } from 'lucide-react';
import resourceApi from '../../services/resourceApi';

const empty = { name: '', email: '', password: '', role: 'staff' };
const roles = { staff: 'Funcionario', manager: 'Gerente', admin: 'Administrador' };

const Users = () => {
  const currentUser = JSON.parse(localStorage.getItem('@CoreFlow:user') || '{}');
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const loadData = () => resourceApi.get('/users').then(({ data }) => setUsers(data)).catch((err) => setError(err.response?.data?.error || 'Erro ao carregar usuarios.'));
  useEffect(() => { loadData(); }, []);
  const filtered = useMemo(() => users.filter((user) => `${user.name} ${user.email} ${roles[user.role]}`.toLowerCase().includes(search.toLowerCase())), [users, search]);
  const submit = async (event) => {
    event.preventDefault();
    try { await resourceApi.post('/users', form); setForm(empty); setMessage('Usuario criado com sucesso.'); setError(''); loadData(); } catch (err) { setError(err.response?.data?.error || 'Erro ao criar usuario.'); }
  };
  const changeRole = async (id, role) => {
    try { await resourceApi.put(`/users/${id}/role`, { role }); setMessage('Cargo atualizado.'); loadData(); } catch (err) { setError(err.response?.data?.error || 'Erro ao alterar cargo.'); }
  };
  const remove = async (id) => {
    if (!window.confirm('Remover este usuario da equipe?')) return;
    try { await resourceApi.delete(`/users/${id}`); setMessage('Usuario removido.'); loadData(); } catch (err) { setError(err.response?.data?.error || 'Erro ao remover usuario.'); }
  };
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="surface-card">
        <div className="mb-5 flex items-start gap-3"><div className="rounded-xl bg-violet-500/15 p-3 text-violet-300"><UserCog size={20} /></div><div><h2 className="text-xl font-bold text-white">Usuarios e cargos</h2><p className="mt-1 text-sm text-slate-400">Controle quem acessa o tenant e qual nivel de permissao cada pessoa possui.</p></div></div>
        {message && <p className="mb-4 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-300">{message}</p>}{error && <p className="mb-4 text-sm text-red-400">{error}</p>}
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
          <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Nome" className="professional-input" />
          <input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="E-mail" className="professional-input" />
          <input required type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Senha inicial" className="professional-input" />
          <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="professional-input">{Object.entries(roles).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
          <button className="primary-action md:col-span-2">Adicionar usuario</button>
        </form>
      </section>
      <section className="surface-card">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><ShieldCheck className="text-violet-300" size={18} /><h3 className="font-semibold text-white">Equipe do tenant</h3></div><label className="relative min-w-60 flex-1 sm:max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar usuario" className="professional-input pl-9" /></label></div>
        <div className="space-y-3">{filtered.map((user) => <article key={user.id} className="invoice-card flex flex-wrap items-center justify-between gap-3"><div><p className="font-medium text-white">{user.name}{user.id === currentUser.id && <span className="ml-2 info-chip">Voce</span>}</p><p className="mt-1 text-sm text-slate-500">{user.email}</p></div><div className="flex flex-wrap gap-2"><select value={user.role} onChange={(event) => changeRole(user.id, event.target.value)} disabled={user.id === currentUser.id} className="professional-input max-w-44">{Object.entries(roles).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>{user.id !== currentUser.id && <button onClick={() => remove(user.id)} className="danger-action"><Trash2 size={14} /> Remover</button>}</div></article>)}</div>
      </section>
    </div>
  );
};

export default Users;
