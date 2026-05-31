import { useState } from 'react';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from './AuthShell';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/login', { email, password });
      localStorage.setItem('@CoreFlow:token', response.data.token);
      if (response.data.user) localStorage.setItem('@CoreFlow:user', JSON.stringify(response.data.user));
      navigate(response.data.user?.Tenant?.isActive ? '/' : '/ativar-licenca');
    } catch (err) {
      setError(err.response?.data?.error || 'E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="auth-card">
        <div>
          <p className="auth-card__eyebrow">Bem-vindo de volta</p>
          <h2 className="auth-card__title">Acesse sua conta</h2>
          <p className="auth-card__description">Entre com suas credenciais para continuar no CoreFlow.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="auth-label">E-mail</label>
            <div className="relative">
              <Mail className="auth-input__icon" size={18} />
              <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="seu@email.com" className="auth-input pl-10" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="auth-label">Senha</label>
              <span className="text-xs text-violet-300">Acesso protegido</span>
            </div>
            <div className="relative">
              <Lock className="auth-input__icon" size={18} />
              <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="********" className="auth-input pl-10 pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-violet-300">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Acessar sistema'}
          </button>
        </form>

        <div className="auth-card__footer">
          <p className="text-sm text-slate-500">
            Ainda nao possui conta?{' '}
            <Link to="/register" className="font-medium text-violet-400 transition-colors hover:text-violet-300">Cadastre-se</Link>
          </p>
        </div>
      </div>
    </AuthShell>
  );
};

export default Login;
