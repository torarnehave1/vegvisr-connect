import { Globe } from 'lucide-react';
import type { Language } from '../lib/i18n';

const labelMap: Record<Language, string> = {
  en: 'EN',
  no: 'NO',
  nl: 'NL',
  is: 'IS'
};

const languageOptions: Array<{ value: Language; label: string }> = [
  { value: 'en', label: 'English' },
  { value: 'no', label: 'Norsk' },
  { value: 'nl', label: 'Nederlands' },
  { value: 'is', label: 'Icelandic' }
];

interface LanguageToggleProps {
  language: Language;
  onToggle: (language: Language) => void;
}

const LanguageToggle = ({ language, onToggle }: LanguageToggleProps) => {
  return (
    <label className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm font-semibold text-white shadow-glass transition hover:bg-white/20">
      <Globe className="h-4 w-4" />
      <span className="sr-only">Language</span>
      <select
        value={language}
        onChange={(event) => onToggle(event.target.value as Language)}
        className="bg-transparent text-white focus:outline-none"
      >
        {languageOptions.map((option) => (
          <option key={option.value} value={option.value} className="text-slate-900">
            {option.label} ({labelMap[option.value]})
          </option>
        ))}
      </select>
    </label>
  );
};

export default LanguageToggle;
