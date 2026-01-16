import { Globe } from 'lucide-react';
import type { Language } from '../lib/i18n';

const labelMap: Record<Language, string> = {
  en: 'EN',
  is: 'IS',
  no: 'NO'
};

interface LanguageToggleProps {
  language: Language;
  onToggle: (language: Language) => void;
}

const LanguageToggle = ({ language, onToggle }: LanguageToggleProps) => {
  const order: Language[] = ['en', 'no', 'is'];
  const currentIndex = order.indexOf(language);
  const next = order[(currentIndex + 1) % order.length];

  return (
    <button
      type="button"
      onClick={() => onToggle(next)}
      className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm font-semibold text-white shadow-glass transition hover:bg-white/20"
    >
      <Globe className="h-4 w-4" />
      {labelMap[language]}
    </button>
  );
};

export default LanguageToggle;
