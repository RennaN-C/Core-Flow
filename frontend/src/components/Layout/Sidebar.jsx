import { Home, ShoppingCart, Package, Users, BarChart2, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  
  const menuItems = [
    { icon: Home, label: 'Visão Geral', path: '/' },
    { icon: ShoppingCart, label: 'Vendas', path: '/vendas' },
    { icon: Package, label: 'Produtos', path: '/produtos' },
    { icon: Users, label: 'Clientes', path: '/clientes' },
    { icon: BarChart2, label: 'Relatórios', path: '/relatorios' },
    { icon: Settings, label: 'Configurações', path: '/configuracoes' },
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 hidden md:flex flex-col h-screen text-zinc-300">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white tracking-wider flex items-center gap-2">
          {}
          <span className="text-emerald-500">CORE</span>FLOW
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20' 
                  : 'hover:bg-zinc-900 hover:text-white border border-transparent'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors">
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;