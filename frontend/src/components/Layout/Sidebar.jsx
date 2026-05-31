import { CircleUserRound, DollarSign, Home, Layers3, LogOut, Settings, ShieldCheck, UserCog, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTenantProfile } from '../../hooks/useTenantProfile';

const logout = () => {
  localStorage.removeItem('@CoreFlow:token');
  localStorage.removeItem('@CoreFlow:user');
  window.location.href = '/login';
};

const Brand = () => (
  <div className="flex items-center gap-3">
    <div className="flow-mark"><span /></div>
    <div><p className="text-lg font-bold tracking-tight text-white">Core<span className="text-violet-300">Flow</span></p><p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Business OS</p></div>
  </div>
);

const useMenuItems = () => {
  const user = JSON.parse(localStorage.getItem('@CoreFlow:user') || '{}');
  const { profile } = useTenantProfile();
  return [
    { icon: Home, label: 'Visao geral', path: '/' },
    { icon: Layers3, label: 'Operacao', path: '/operacao' },
    { icon: Users, label: profile.customerLabel, path: '/clientes' },
    { icon: DollarSign, label: 'Financeiro', path: '/financeiro', roles: ['admin', 'manager'] },
    { icon: UserCog, label: 'Usuarios', path: '/usuarios', roles: ['admin'] },
    { icon: ShieldCheck, label: 'Auditoria', path: '/auditoria', roles: ['admin'] },
    { icon: Settings, label: 'Configuracoes', path: '/configuracoes', roles: ['admin'] },
    { icon: CircleUserRound, label: 'Perfil', path: '/perfil' },
  ].filter((item) => !item.roles || item.roles.includes(user.role));
};

const NavItem = ({ item, active }) => (
  <Link to={item.path} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all ${active ? 'border-violet-400/20 bg-violet-500/15 text-violet-200 shadow-lg shadow-violet-950/20' : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white'}`}>
    <item.icon size={18} /><span>{item.label}</span>
  </Link>
);

const Sidebar = () => {
  const location = useLocation();
  const menuItems = useMenuItems();
  return (
    <aside className="app-sidebar hidden lg:flex">
      <div className="px-6 py-7"><Brand /></div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-3">{menuItems.map((item) => <NavItem key={item.path} item={item} active={location.pathname === item.path} />)}</nav>
      <div className="border-t border-violet-400/10 p-4"><button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-300"><LogOut size={18} /> Sair da conta</button></div>
    </aside>
  );
};

export const MobileNav = () => {
  const location = useLocation();
  const menuItems = useMenuItems();
  return <nav className="mobile-nav lg:hidden"><div className="flex min-w-max items-center gap-1 px-2">{menuItems.map((item) => <Link key={item.path} to={item.path} className={`mobile-nav__item ${location.pathname === item.path ? 'mobile-nav__item--active' : ''}`}><item.icon size={18} /><span>{item.label}</span></Link>)}</div></nav>;
};

export default Sidebar;
