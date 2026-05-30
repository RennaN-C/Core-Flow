  import { DollarSign, ShoppingBag, Users, TrendingUp, MoreVertical } from 'lucide-react';

  // Componente reutilizável para os Cards
  const StatCard = ({ title, value, change, trend, icon: Icon, colorClass }) => (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-zinc-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className={trend === 'up' ? 'text-emerald-400' : 'text-red-400'}>
          {trend === 'up' ? '↑' : '↓'} {change}
        </span>
        <span className="text-zinc-500 ml-2">vs último mês</span>
      </div>
    </div>
  );

  const Dashboard = () => {

    const recentOrders = [
      { id: '#ORD-001', customer: 'João Silva', date: 'Hoje, 14:30', status: 'Concluído', total: 'R$ 1.250,00' },
      { id: '#ORD-002', customer: 'Maria Santos', date: 'Hoje, 11:20', status: 'Pendente', total: 'R$ 450,00' },
      { id: '#ORD-003', customer: 'Empresa XYZ', date: 'Ontem, 16:45', status: 'Processando', total: 'R$ 3.890,00' },
      { id: '#ORD-004', customer: 'Lucas Oliveira', date: 'Ontem, 09:15', status: 'Cancelado', total: 'R$ 120,00' },
    ];

    return (
      <div className="max-w-7xl mx-auto space-y-6">
        
        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Receita Total" value="R$ 45.231,89" change="+12.5%" trend="up" 
            icon={DollarSign} colorClass="bg-emerald-500/10 text-emerald-500"
          />
          <StatCard 
            title="Vendas" value="356" change="+8.2%" trend="up" 
            icon={ShoppingBag} colorClass="bg-blue-500/10 text-blue-500"
          />
          <StatCard 
            title="Novos Clientes" value="45" change="-2.4%" trend="down" 
            icon={Users} colorClass="bg-purple-500/10 text-purple-500"
          />
          <StatCard 
            title="Ticket Médio" value="R$ 127,05" change="+4.1%" trend="up" 
            icon={TrendingUp} colorClass="bg-orange-500/10 text-orange-500"
          />
        </div>

        {/* Espaço para Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-96 flex flex-col shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-semibold">Visão Geral de Receita</h3>
              <select className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-lg px-3 py-1 focus:outline-none focus:border-emerald-500">
                <option>Últimos 7 dias</option>
                <option>Este Mês</option>
              </select>
            </div>
            <div className="flex-1 border-2 border-dashed border-zinc-800 rounded-xl flex items-center justify-center text-zinc-500">
              [ Aqui instalaremos o pacote de gráficos 'Recharts' em breve ]
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-96 flex flex-col shadow-lg">
            <h3 className="text-white font-semibold mb-6">Vendas por Categoria</h3>
            <div className="flex-1 border-2 border-dashed border-zinc-800 rounded-xl flex items-center justify-center text-zinc-500">
              [ Gráfico de Rosca ]
            </div>
          </div>
        </div>

        {/* Tabela de Dados */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h3 className="text-white font-semibold">Últimos Pedidos</h3>
            <button className="text-emerald-500 hover:text-emerald-400 text-sm font-medium transition-colors">
              Ver todos
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950/50 text-zinc-400 text-sm">
                  <th className="px-6 py-4 font-medium">Pedido</th>
                  <th className="px-6 py-4 font-medium">Cliente</th>
                  <th className="px-6 py-4 font-medium">Data</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Valor Total</th>
                  <th className="px-6 py-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentOrders.map((order, index) => (
                  <tr key={index} className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{order.id}</td>
                    <td className="px-6 py-4 text-zinc-300">{order.customer}</td>
                    <td className="px-6 py-4 text-zinc-400">{order.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Concluído' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        order.status === 'Pendente' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                        order.status === 'Processando' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-medium">{order.total}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-zinc-500 hover:text-white transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  export default Dashboard;