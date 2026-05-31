import { Building2, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { useTenantProfile } from '../../hooks/useTenantProfile';

const roles = { staff: 'Funcionario', manager: 'Gerente', admin: 'Administrador' };

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('@CoreFlow:user') || '{}');
  const { tenant, profile } = useTenantProfile();
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="surface-card">
        <div className="mb-5 flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-fuchsia-500 text-2xl font-bold text-white">{user.name?.charAt(0)?.toUpperCase() || 'U'}</div><div><h2 className="text-xl font-bold text-white">{user.name}</h2><p className="mt-1 text-sm text-slate-400">{roles[user.role] || user.role}</p></div></div>
        <div className="grid gap-3 md:grid-cols-2">
          <Info Icon={UserRound} label="Nome" value={user.name} />
          <Info Icon={Mail} label="E-mail" value={user.email} />
          <Info Icon={ShieldCheck} label="Cargo" value={roles[user.role] || user.role} />
          <Info Icon={Building2} label="Empresa" value={tenant?.name || 'Carregando...'} />
        </div>
      </section>
      <section className="surface-card"><h3 className="font-semibold text-white">Perfil licenciado do ambiente</h3><p className="mt-2 text-sm leading-6 text-slate-400">{profile.name}: {profile.headline}</p><div className="mt-3 flex flex-wrap gap-2">{profile.modules.map((module) => <span key={module.id} className="info-chip">{module.label}</span>)}</div></section>
    </div>
  );
};

const Info = ({ Icon, label, value }) => <div className="invoice-card flex items-center gap-3"><Icon className="text-violet-300" size={18} /><div><p className="text-xs uppercase tracking-wider text-slate-500">{label}</p><p className="mt-1 text-sm text-white">{value}</p></div></div>;

export default Profile;
