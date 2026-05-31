import { useEffect, useMemo, useState } from 'react';
import { FileSearch, Search, ShieldCheck } from 'lucide-react';
import resourceApi from '../../services/resourceApi';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('ALL');
  useEffect(() => { resourceApi.get('/audit-logs').then(({ data }) => setLogs(data)).catch((err) => setError(err.response?.data?.error || 'Erro ao carregar auditoria.')); }, []);
  const actions = useMemo(() => [...new Set(logs.map((log) => log.action))], [logs]);
  const filtered = useMemo(() => logs.filter((log) => (action === 'ALL' || log.action === action) && `${log.action} ${log.User?.name || ''} ${log.entity_type || ''}`.toLowerCase().includes(search.toLowerCase())), [logs, search, action]);
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="surface-card">
        <div className="mb-4 flex items-start gap-3"><div className="rounded-xl bg-violet-500/15 p-3 text-violet-300"><ShieldCheck size={20} /></div><div><h2 className="text-xl font-bold text-white">Logs de auditoria</h2><p className="mt-1 text-sm text-slate-400">Rastreie alteracoes importantes realizadas dentro do tenant.</p></div></div>
        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
        <div className="mb-4 flex flex-wrap gap-2"><label className="relative min-w-60 flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar evento, usuario ou entidade" className="professional-input pl-9" /></label><select value={action} onChange={(event) => setAction(event.target.value)} className="professional-input max-w-64"><option value="ALL">Todas as acoes</option>{actions.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
        <div className="space-y-3">{filtered.length === 0 ? <p className="text-sm text-slate-500">Nenhum evento encontrado.</p> : filtered.map((log) => <article key={log.id} className="invoice-card"><div className="flex items-start gap-3"><FileSearch className="mt-1 shrink-0 text-violet-300" size={17} /><div><p className="font-medium text-white">{log.action}</p><p className="mt-1 text-sm text-slate-500">{log.User?.name || 'Sistema'} | {log.entity_type || 'N/A'} | {new Date(log.createdAt).toLocaleString('pt-BR')}</p>{log.details && Object.keys(log.details).length > 0 && <p className="mt-2 break-all text-xs text-slate-500">{JSON.stringify(log.details)}</p>}</div></div></article>)}</div>
      </section>
    </div>
  );
};

export default AuditLogs;
