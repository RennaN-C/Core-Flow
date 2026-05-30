import { useState } from "react";
import api from "../../services/api";
import { Key, Loader2, AlertTriangle, LogOut } from "lucide-react";

const ActivateLicense = () => {
  const [licenseKey, setLicenseKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleActivate = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError("");

    try {
     
      await api.post("/activate", { licenseKey });
      
     
      const userStr = localStorage.getItem("@CoreFlow:user");
      
      if (userStr) {
        const user = JSON.parse(userStr);
        
        user.Tenant = { ...user.Tenant, isActive: true };
        localStorage.setItem("@CoreFlow:user", JSON.stringify(user));
      }

      
      window.location.href = "/";
    } catch (err) {
      console.error("Erro na ativação:", err);
      setError(err.response?.data?.error || "Chave inválida ou erro na ativação.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    
    localStorage.removeItem("@CoreFlow:token");
    localStorage.removeItem("@CoreFlow:user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        
        <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white mb-2">Sistema Bloqueado</h2>
          <p className="text-zinc-400 text-sm">Sua empresa ainda não possui uma licença ativa. Insira sua chave de ativação abaixo para liberar o sistema.</p>
        </div>

        {error && <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-xl text-center mb-4">{error}</div>}

        <form onSubmit={handleActivate} className="space-y-4">
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              required 
              value={licenseKey} 
              onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
              placeholder="Ex: ABCD-1234-EFGH-5678" 
              className="w-full bg-zinc-950 border border-zinc-800 text-white font-mono rounded-xl pl-10 pr-4 py-3 focus:border-emerald-500 focus:outline-none uppercase tracking-wider"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-emerald-500 text-zinc-950 font-bold py-3 rounded-xl flex justify-center hover:bg-emerald-600 transition-colors">
            {loading ? <Loader2 className="animate-spin" /> : "Ativar Sistema"}
          </button>
        </form>

        <button onClick={handleLogout} className="mt-6 text-zinc-500 hover:text-zinc-300 text-sm flex items-center justify-center w-full gap-2 transition-colors">
          <LogOut size={16} /> Sair da conta
        </button>
      </div>
    </div>
  );
};
export default ActivateLicense;
