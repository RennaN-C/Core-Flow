import { LogOut, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';

const pages = {
  '/': ['Visao geral', 'Acompanhe os indicadores da sua operacao'],
  '/clientes': ['Clientes', 'Organize sua base de relacionamento'],
  '/operacao': ['Operacao', 'Explore os recursos ativos para seu negocio'],
  '/financeiro': ['Financeiro', 'Gerencie cobrancas e recebimentos'],
  '/usuarios': ['Usuarios e cargos', 'Defina os acessos da sua equipe'],
  '/auditoria': ['Auditoria', 'Consulte as alteracoes importantes'],
  '/perfil': ['Meu perfil', 'Confira seus dados de acesso'],
  '/configuracoes': ['Configuracoes', 'Personalize os dados do seu tenant'],
};

const Header = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('@CoreFlow:user') || '{}');
  const [title, subtitle] = pages[location.pathname] || pages['/'];
  const logout = () => {
    localStorage.removeItem('@CoreFlow:token');
    localStorage.removeItem('@CoreFlow:user');
    window.location.href = '/login';
  };
  return (
    <header className="app-header">
      <div>
        <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-400"><Sparkles size={14} /> CoreFlow</div>
        <h2 className="text-xl font-semibold text-white sm:text-2xl">{title}</h2>
        <p className="hidden text-sm text-slate-500 sm:block">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3 sm:gap-5">
        <ThemeToggle compact />
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-500 font-bold text-white shadow-lg shadow-violet-900/40">{user.name?.charAt(0)?.toUpperCase() || 'U'}</div>
          <div className="hidden text-sm sm:block"><p className="font-medium text-white">{user.name || 'Usuario'}</p><p className="text-xs capitalize text-slate-500">{user.role || 'staff'}</p></div>
        </div>
        <button onClick={logout} className="header-logout lg:hidden" aria-label="Sair da conta" title="Sair da conta"><LogOut size={17} /></button>
      </div>
    </header>
  );
};

export default Header;
