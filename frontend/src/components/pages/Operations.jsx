import { CheckCircle2, CircleDot, KeyRound, Layers3, Sparkles } from 'lucide-react';
import { useTenantProfile } from '../../hooks/useTenantProfile';

const Operations = () => {
  const { tenant, profile } = useTenantProfile();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="dashboard-hero">
        <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-violet-200"><Sparkles size={15} /> Perfil inteligente</p>
        <h2 className="max-w-2xl text-2xl font-semibold text-white sm:text-3xl">{profile.name}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-violet-100/75">{profile.headline}</p>
      </section>

      <section className="surface-card">
        <div className="mb-4 flex items-start gap-3"><Layers3 className="mt-0.5 text-violet-300" size={19} /><div><h3 className="font-semibold text-white">Modulos incluidos na licenca</h3><p className="mt-1 text-sm text-slate-500">Cada modulo traz opcoes especificas para a rotina de {profile.name.toLowerCase()}.</p></div></div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {profile.modules.map((module) => (
            <article key={module.id} className="niche-card niche-card--active">
              <div className="flex items-center justify-between gap-3"><p className="font-medium text-white">{module.label}</p><CheckCircle2 className="text-emerald-400" size={18} /></div>
              <p className="mt-2 text-sm leading-5 text-slate-400">{module.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">{module.options.map((option) => <span key={option} className="info-chip">{option}</span>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-card">
        <h3 className="mb-4 font-semibold text-white">Prioridades operacionais</h3>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {profile.operationalFeatures.map((feature) => <div key={feature} className="flex items-center gap-3 rounded-xl border border-violet-400/10 bg-slate-950/15 p-4 text-sm text-slate-300"><CircleDot className="shrink-0 text-violet-300" size={16} /> {feature}</div>)}
        </div>
      </section>

      <p className="flex items-center gap-2 text-xs text-slate-500"><KeyRound size={14} /> Ambiente de {tenant?.name || 'seu tenant'} configurado pela licenca criada no cadastro.</p>
    </div>
  );
};

export default Operations;
