import LanguageToggle from './LanguageToggle';
import logo from '../assets/connect.png';
import type { Language } from '../lib/i18n';

interface HeaderProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const Header = ({ language, onLanguageChange }: HeaderProps) => {
  return (
    <header className="px-6 py-6">
      <div className="mx-auto flex w-full max-w-4xl items-start justify-between">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Vegvisr Connect" className="h-[300px] w-[300px]" />
          
        </div>
        <LanguageToggle language={language} onToggle={onLanguageChange} />
      </div>
    </header>
  );
};

export default Header;
