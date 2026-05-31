import { useEffect, useState } from 'react';
import { Briefcase, CheckCircle, Copy, FileText, Key, Loader2, Lock, Mail, Phone, Store, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthShell from './AuthShell';
import api from '../services/api';
import resourceApi from '../services/resourceApi';

const inputClass = 'auth-input pl-10';

const Register = () => {
  const [profiles, setProfiles] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', companyName: '', companyDocument: '', companyPhone: '', profile_id: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedLicense, setGeneratedLicense] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { resourceApi.get('/business-profiles').then(({ data }) => setProfiles(data)).catch(() => setError('Nao foi possivel carregar os segmentos de negocio.')); }, []);

  const handleChange = (event) => setFormData({ ...formData, [event.target.name]: event.target.value });
  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/register', formData);
      const selectedProfile = profiles.find((profile) => profile.id === formData.profile_id);
      setGeneratedLicense({ key: response.data.licenseKey, profile: selectedProfile });
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao realizar o cadastro. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLicense.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (generatedLicense) {
    return <AuthShell><div className="auth-card text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300"><Key size={30} /></div><div><p className="auth-card__eyebrow">Cadastro concluido</p><h2 className="auth-card__title">Sua licenca foi gerada</h2><p className="auth-card__description">Guarde esta chave. Ela sera usada para ativar o ambiente apos o login.</p></div><div className="rounded-xl border border-violet-400/15 bg-violet-500/5 p-3 text-left"><p className="text-xs font-semibold uppercase tracking-wider text-violet-300">Perfil vinculado</p><p className="mt-1 text-sm font-semibold text-white">{generatedLicense.profile?.name}</p><p className="mt-1 text-xs leading-5 text-slate-400">Este nicho e seus modulos ficam vinculados a licenca do tenant.</p></div><div className="flex items-center justify-between gap-2 rounded-xl border border-violet-400/15 bg-slate-950/60 p-3"><code className="break-all text-sm font-semibold tracking-wide text-violet-300">{generatedLicense.key}</code><button onClick={copyToClipboard} className="rounded-lg bg-violet-500/15 p-2 text-violet-300 transition-colors hover:bg-violet-500/25">{copied ? <CheckCircle size={19} /> : <Copy size={19} />}</button></div><Link to="/login" className="auth-submit">Ir para o login</Link></div></AuthShell>;
  }

  return (
    <AuthShell>
      <div className="auth-card auth-card--wide">
        <div><p className="auth-card__eyebrow">Comece agora</p><h2 className="auth-card__title">Crie seu ambiente CoreFlow</h2><p className="auth-card__description">Escolha o segmento para receber recursos e campos adequados ao seu negocio.</p></div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleRegister} className="grid gap-5 md:grid-cols-2">
          <div className="space-y-3">
            <p className="auth-section-title">Administrador</p>
            <Field Icon={User} name="name" placeholder="Seu nome" onChange={handleChange} />
            <Field Icon={Mail} name="email" type="email" placeholder="E-mail de acesso" onChange={handleChange} />
            <Field Icon={Lock} name="password" type="password" placeholder="Senha" onChange={handleChange} />
          </div>
          <div className="space-y-3">
            <p className="auth-section-title">Empresa</p>
            <Field Icon={Briefcase} name="companyName" placeholder="Nome da empresa" onChange={handleChange} />
            <div className="relative"><Store className="auth-input__icon" size={18} /><select required name="profile_id" value={formData.profile_id} onChange={handleChange} className={inputClass}><option value="" disabled>Selecione seu segmento</option>{profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name}</option>)}</select></div>
            <Field Icon={FileText} name="companyDocument" placeholder="CNPJ ou CPF (opcional)" onChange={handleChange} required={false} />
            <Field Icon={Phone} name="companyPhone" placeholder="Telefone (opcional)" onChange={handleChange} required={false} />
          </div>
          <button type="submit" disabled={loading} className="auth-submit md:col-span-2">{loading ? <Loader2 className="animate-spin" /> : 'Gerar licenca e cadastrar'}</button>
        </form>
        <div className="auth-card__footer"><p className="text-sm text-slate-500">Ja possui conta? <Link to="/login" className="font-medium text-violet-400">Faca login</Link></p></div>
      </div>
    </AuthShell>
  );
};

const Field = ({ Icon, required = true, type = 'text', ...props }) => <div className="relative"><Icon className="auth-input__icon" size={18} /><input required={required} type={type} className={inputClass} {...props} /></div>;

export default Register;
