import type { Language } from './i18n';

const EMAIL_KEY = 'vegvisr_email';
const LANGUAGE_KEY = 'vegvisr_language';

export const getStoredEmail = (): string | null => {
  return localStorage.getItem(EMAIL_KEY);
};

export const setStoredEmail = (email: string) => {
  localStorage.setItem(EMAIL_KEY, email);
};

export const clearStoredEmail = () => {
  localStorage.removeItem(EMAIL_KEY);
};

export const getStoredLanguage = (): Language => {
  const stored = localStorage.getItem(LANGUAGE_KEY);
  if (stored === 'is' || stored === 'en') {
    return stored;
  }
  return 'en';
};

export const setStoredLanguage = (language: Language) => {
  localStorage.setItem(LANGUAGE_KEY, language);
};
