import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const getInitialTheme = () => {
  const saved = localStorage.getItem('@CoreFlow:theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const ThemeToggle = ({ compact = false }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('@CoreFlow:theme', theme);
  }, [theme]);

  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const Icon = theme === 'dark' ? Sun : Moon;

  return (
    <button type="button" onClick={() => setTheme(nextTheme)} className={`theme-toggle ${compact ? 'theme-toggle--compact' : ''}`} aria-label={`Ativar tema ${nextTheme === 'dark' ? 'escuro' : 'claro'}`} title={`Ativar tema ${nextTheme === 'dark' ? 'escuro' : 'claro'}`}>
      <Icon size={17} />
      {!compact && <span>{theme === 'dark' ? 'Tema claro' : 'Tema escuro'}</span>}
    </button>
  );
};

export default ThemeToggle;
