import { useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { Lock, Mail, User, Briefcase, FileText, Phone, Loader2, Key, Copy, CheckCircle, Store } from "lucide-react";

const Register = () => {
 
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", companyName: "", companyDocument: "", companyPhone: "", business_type: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedLicense, setGeneratedLicense] = useState(null); 
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const response = await api.post("/register", formData);
      setGeneratedLicense(response.data.licenseKey); 
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao realizar o cadastro. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLicense);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (generatedLicense) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-zinc-900 border border-emerald-500/30 rounded-2xl p-8 shadow-2xl shadow-emerald-500/10 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
          
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key size={32} />
          </div>
          
          <h2 className="text-2xl font-bold text-white">Licença Gerada!</h2>
          <p className="text-zinc-400 text-sm">Guarde esta chave. Você precisará dela para ativar o sistema após o login.</p>
          
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-center justify-between group">
            <code className="text-emerald-400 font-mono text-lg tracking-wider">{generatedLicense}</code>
            <button onClick={copyToClipboard} className="text-zinc-500 hover:text-emerald-400 transition-colors p-2 bg-zinc-900 rounded-lg">
              {copied ? <CheckCircle size={20} className="text-emerald-500" /> : <Copy size={20} />}
            </button>
          </div>

          <Link to="/login" className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center mt-6">
            Ir para o Login
          </Link>
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-wider"><span className="text-emerald-500">CORE</span>FLOW</h1>
          <p className="text-zinc-400 text-sm">Registre sua empresa e gere sua licença de uso</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl text-center">{error}</div>}

        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dados do Usuário */}
          <div className="space-y-4 md:border-r border-zinc-800 md:pr-4">
            <h3 className="text-emerald-500 text-sm font-semibold uppercase tracking-wider mb-2">Dados do Administrador</h3>
            <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} /><input type="text" required name="name" onChange={handleChange} placeholder="Seu nome" className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-emerald-500 focus:outline-none" /></div>
            <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} /><input type="email" required name="email" onChange={handleChange} placeholder="E-mail de acesso" className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-emerald-500 focus:outline-none" /></div>
            <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} /><input type="password" required name="password" onChange={handleChange} placeholder="Senha" className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-emerald-500 focus:outline-none" /></div>
          </div>

          {/* Dados da Empresa */}
          <div className="space-y-4 md:pl-4">
            <h3 className="text-emerald-500 text-sm font-semibold uppercase tracking-wider mb-2">Dados da Empresa</h3>
            <div className="relative"><Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} /><input type="text" required name="companyName" onChange={handleChange} placeholder="Nome Fantasia / Razão Social" className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-emerald-500 focus:outline-none" /></div>
            
            {}
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <select 
                name="business_type" 
                required 
                value={formData.business_type}
                onChange={handleChange} 
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-emerald-500 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="" disabled>Selecione o tipo de negócio</option>
                <option value="varejo">Varejo</option>
                <option value="academia">Academia</option>
                <option value="clinica">Clínica</option>
                <option value="barbearia">Barbearia</option>
                <option value="igreja">Igreja</option>
              </select>
              {}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                ▼
              </div>
            </div>

            <div className="relative"><FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} /><input type="text" name="companyDocument" onChange={handleChange} placeholder="CNPJ ou CPF (Opcional)" className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-emerald-500 focus:outline-none" /></div>
            <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} /><input type="text" name="companyPhone" onChange={handleChange} placeholder="Telefone (Opcional)" className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-emerald-500 focus:outline-none" /></div>
          </div>

          <div className="col-span-1 md:col-span-2 mt-4">
            <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold py-3 rounded-xl transition-colors flex justify-center">{loading ? <Loader2 className="animate-spin" /> : "Gerar Licença e Cadastrar"}</button>
          </div>
        </form>
        
        <div className="text-center pt-2 border-t border-zinc-800"><p className="text-zinc-500 text-sm">Já possui conta? <Link to="/login" className="text-emerald-400">Faça Login</Link></p></div>
      </div>
    </div>
  );
};

export default Register;
