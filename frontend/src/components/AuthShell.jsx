import { BarChart3, ShieldCheck, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const features = [
  [BarChart3, 'Indicadores em tempo real'],
  [ShieldCheck, 'Operacao segura por tenant'],
  [Sparkles, 'Insights para decidir melhor'],
];

const AuthShell = ({ children }) => (
  <div className="auth-shell">
    <section className="auth-shell__story">
      <div className="auth-shell__overlay" />
      <div className="auth-shell__content">
        <img className="auth-shell__wordmark" src="/images/coreflow-wordmark.png" alt="CoreFlow" />
        <div className="auth-shell__copy">
          <p className="auth-shell__eyebrow">Gestao empresarial inteligente</p>
          <h1>Organize sua operacao em um unico fluxo.</h1>
          <p>Clientes, cobrancas, acessos e insights conectados em uma experiencia simples para sua equipe.</p>
        </div>
        <div className="auth-shell__features">
          {features.map(([Icon, label]) => (
            <div key={label} className="auth-shell__feature">
              <Icon size={18} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
    <main className="auth-shell__panel">
      <div className="auth-shell__theme"><ThemeToggle compact /></div>
      <img className="auth-shell__mobile-wordmark" src="/images/coreflow-wordmark.png" alt="CoreFlow" />
      {children}
    </main>
  </div>
);

export default AuthShell;
