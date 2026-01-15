import LanguageToggle from './LanguageToggle';
import type { Language } from '../lib/i18n';

interface HeaderProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const Header = ({ language, onLanguageChange }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between px-6 py-6">
      <div className="text-lg font-semibold tracking-[0.2em] text-white/70">
        VEGVISR
      </div>
      <LanguageToggle language={language} onToggle={onLanguageChange} />
    </header>
  );
};

export default Header;
