import { useState } from 'react';
import { AlertTriangle, Key, Loader2, LogOut } from 'lucide-react';
import AuthShell from '../AuthShell';
import api from '../../services/api';

const ActivateLicense = () => {
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleActivate = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/activate', { licenseKey });
      const userStr = localStorage.getItem('@CoreFlow:user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.Tenant = { ...user.Tenant, isActive: true };
        localStorage.setItem('@CoreFlow:user', JSON.stringify(user));
      }
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.error || 'Chave invalida ou erro na ativacao.');
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('@CoreFlow:token');
    localStorage.removeItem('@CoreFlow:user');
    window.location.href = '/login';
  };

  return (
    <AuthShell>
      <div className="auth-card">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400"><AlertTriangle size={30} /></div>
        <div>
          <p className="auth-card__eyebrow">Ativacao necessaria</p>
          <h2 className="auth-card__title">Libere seu ambiente</h2>
          <p className="auth-card__description">Sua empresa ainda nao possui uma licenca ativa. Insira sua chave para liberar o sistema.</p>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleActivate} className="space-y-4">
          <div className="relative">
            <Key className="auth-input__icon" size={18} />
            <input type="text" required value={licenseKey} onChange={(event) => setLicenseKey(event.target.value.toUpperCase())} placeholder="ABCD-1234-EFGH-5678" className="auth-input pl-10 font-mono uppercase tracking-wider" />
          </div>
          <button type="submit" disabled={loading} className="auth-submit">{loading ? <Loader2 className="animate-spin" /> : 'Ativar sistema'}</button>
        </form>
        <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-300"><LogOut size={16} /> Sair da conta</button>
      </div>
    </AuthShell>
  );
};

export default ActivateLicense;
