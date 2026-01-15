import { useState } from 'react';
import { Mail, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getGoogleRedirectUrl, requestMagicLink } from '../lib/api';
import { useLanguage } from '../lib/LanguageContext';
import { useTranslation } from '../lib/useTranslation';

const Home = () => {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const { url } = await getGoogleRedirectUrl();
      window.location.href = url;
    } catch (err) {
      setError(t('auth.callbackError'));
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email.trim()) {
      setError(t('common.required'));
      return;
    }
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await requestMagicLink(email.trim());
      setMessage(t('home.linkSent'));
    } catch (err) {
      setError(t('auth.failure'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[1.2fr,0.8fr]">
      <div className="space-y-6 text-white">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
          <Sparkles className="h-4 w-4" />
          Vegvisr onboarding
        </div>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
          <span className="gradient-text">{t('home.title')}</span>
        </h1>
        <p className="text-lg text-white/70">{t('home.subtitle')}</p>
        <div className="glass rounded-3xl p-6 shadow-glass">
          <p className="text-sm font-semibold text-white/80">{t('home.chooseAuth')}</p>
          <div className="mt-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {t('home.google')}
              <span className="text-xs text-white/70">G</span>
            </button>
            <div className="rounded-2xl border border-white/30 bg-white/10 p-4">
              <label className="text-xs font-semibold uppercase tracking-widest text-white/60">
                {t('common.emailLabel')}
              </label>
              <div className="mt-2 flex flex-col gap-3 md:flex-row">
                <input
                  type="email"
                  placeholder={t('home.emailPlaceholder')}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/60 focus:outline-none"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleMagicLink}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Mail className="h-4 w-4" />
                  {t('home.sendLink')}
                </button>
              </div>
            </div>
            {message && (
              <p className="text-sm text-emerald-200">{message}</p>
            )}
            {error && <p className="text-sm text-rose-200">{error}</p>}
          </div>
        </div>
      </div>
      <div className="glass h-fit rounded-3xl p-6 text-white shadow-glass md:mt-24">
        <h2 className="text-2xl font-semibold">{t('onboarding.title')}</h2>
        <p className="mt-3 text-sm text-white/70">{t('common.autosaveHint')}</p>
        <ul className="mt-6 space-y-3 text-sm text-white/70">
          <li>1. {t('onboarding.questions.name')}</li>
          <li>2. {t('onboarding.learning.motivation')}</li>
          <li>3. {t('onboarding.interests.title')}</li>
        </ul>
        <button
          type="button"
          onClick={() => navigate('/onboarding')}
          className="mt-6 w-full rounded-xl border border-white/30 bg-white/10 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/20"
        >
          {t('onboarding.next')}
        </button>
      </div>
    </section>
  );
};

export default Home;
