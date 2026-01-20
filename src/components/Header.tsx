import LanguageToggle from './LanguageToggle';
import logo from '../assets/connect.png';
import type { Language } from '../lib/i18n';

interface HeaderProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
  logoUrl?: string | null;
  slogan?: string | null;
}

const Header = ({ language, onLanguageChange, logoUrl, slogan }: HeaderProps) => {
  return (
    <header className="px-6 py-6">
      <div className="mx-auto flex w-full max-w-4xl items-start justify-between">
        <div className="flex items-center gap-4">
          <img
            src={logoUrl || logo}
            alt="Vegvisr Connect"
            className="h-[150px] w-[150px]"
          />
          {slogan && (
            <p className="text-sm text-white/70">{slogan}</p>
          )}
        </div>
        <LanguageToggle language={language} onToggle={onLanguageChange} />
      </div>
    </header>
  );
};

export default Header;
