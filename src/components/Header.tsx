import LanguageToggle from './LanguageToggle';
import logo from '../assets/connect.png';
import type { Language } from '../lib/i18n';

interface HeaderProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const Header = ({ language, onLanguageChange }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between px-6 py-6">
      <div className="flex items-center gap-4">
       
        <img src={logo} alt="Vegvisr Connect" className="h-[300px] w-[300px]" />

        <div className="text-lg font-semibold tracking-[0.2em] text-white/70">
          VEGVISR
        </div>
      </div>
      <LanguageToggle language={language} onToggle={onLanguageChange} />
    </header>
  );
};

export default Header;
