import { useEffect, useState } from 'react';
import { CircleCheck, DollarSign, FileClock, Sparkles, Users } from 'lucide-react';
import resourceApi from '../../services/resourceApi';
import { useTenantProfile } from '../../hooks/useTenantProfile';

const money = (value) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const Dashboard = () => {
  const { profile } = useTenantProfile();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { resourceApi.get('/insights').then(({ data }) => setData(data)).catch((err) => setError(err.response?.data?.error || 'Nao foi possivel carregar os indicadores.')); }, []);
  if (error) return <p className="text-red-400">{error}</p>;
  if (!data) return <p className="text-slate-400">Carregando indicadores...</p>;
  const maxRevenue = Math.max(...data.revenueByMonth.map((month) => month.value), 1);
  const cards = [
    ['Receita confirmada', 'paidRevenue', DollarSign, 'from-violet-500 to-fuchsia-500'],
    [profile.customerLabel, 'customers', Users, 'from-blue-500 to-indigo-500'],
    ['Cobrancas pendentes', 'pendingInvoices', FileClock, 'from-orange-400 to-amber-500'],
    ['Cobrancas pagas', 'paidInvoices', CircleCheck, 'from-emerald-400 to-teal-500'],
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="dashboard-hero">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200"><Sparkles size={15} /> Resumo operacional</p>
          <h3 className="max-w-xl text-2xl font-semibold text-white sm:text-3xl">{profile.headline}</h3>
          <p className="mt-3 max-w-xl text-sm leading-6 text-violet-100/70">Ambiente CoreFlow adaptado para {profile.name.toLowerCase()}.</p>
        </div>
      </section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, key, Icon, gradient]) => (
          <div key={key} className="metric-card">
            <div className={`mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}><Icon size={19} /></div>
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{key === 'paidRevenue' ? money(data.metrics[key]) : data.metrics[key]}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <section className="surface-card xl:col-span-2">
          <h3 className="mb-6 font-semibold text-white">Receita confirmada nos ultimos 6 meses</h3>
          <div className="flex h-56 items-end gap-2 border-b border-violet-400/10 sm:gap-4">
            {data.revenueByMonth.map((month) => <div key={month.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="hidden text-xs text-slate-400 sm:block">{money(month.value)}</span><div className="min-h-1 w-full max-w-16 rounded-t-lg bg-gradient-to-t from-violet-700 to-violet-400" style={{ height: `${(month.value / maxRevenue) * 80}%` }} /><span className="text-[10px] text-slate-500 sm:text-xs">{month.label}</span></div>)}
          </div>
        </section>
        <section className="surface-card">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-violet-300"><Sparkles size={16} /> Insights operacionais</p>
          <p className="text-sm leading-6 text-slate-300">{data.insight}</p>
        </section>
      </div>
      <section className="surface-card">
        <h3 className="mb-4 font-semibold text-white">Visao operacional do nicho</h3>
        <div className="grid gap-3 md:grid-cols-3">{profile.operationalFeatures.map((feature) => <div key={feature} className="niche-card"><p className="text-sm font-medium text-white">{feature}</p><p className="mt-2 text-xs text-slate-500">Acompanhe este indicador na rotina da operacao.</p></div>)}</div>
      </section>
      <section className="surface-card">
        <h3 className="mb-4 font-semibold text-white">Ultimas cobrancas</h3>
        {data.recentInvoices.length === 0 ? <p className="text-slate-500">Nenhuma cobranca registrada.</p> : data.recentInvoices.map((invoice) => <div key={invoice.id} className="flex flex-wrap justify-between gap-2 border-b border-violet-400/10 py-3 text-sm"><span className="text-slate-300">{invoice.Person?.name} - {invoice.description}</span><span className="text-white">{money(invoice.amount)} | {invoice.status}</span></div>)}
      </section>
    </div>
  );
};

export default Dashboard;
