import { Bell, Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-20 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-xl font-semibold text-white">Dashboard</h2>
        <p className="text-sm text-zinc-400">Acompanhe as métricas do seu negócio</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all w-64 placeholder:text-zinc-600"
          />
        </div>

        <button className="text-zinc-400 hover:text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full"></span>
        </button>
        
        <div className="h-8 w-px bg-zinc-800"></div>

        <div className="flex items-center gap-3 cursor-pointer">
          <img 
            src="https://ui-avatars.com/api/?name=Rennan&background=10b981&color=fff" 
            alt="User" 
            className="w-9 h-9 rounded-full border-2 border-zinc-800"
          />
          <div className="hidden sm:block text-sm">
            <p className="text-white font-medium">Rennan</p>
            <p className="text-zinc-500 text-xs">Administrador</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;