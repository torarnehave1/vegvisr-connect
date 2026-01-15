import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exchangeOAuthCode } from '../lib/api';
import { useLanguage } from '../lib/LanguageContext';
import { useTranslation } from '../lib/useTranslation';
import { setStoredEmail } from '../lib/storage';

const AuthCallback = () => {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setError(t('auth.callbackError'));
      return;
    }

    const run = async () => {
      try {
        const { email } = await exchangeOAuthCode(code);
        setStoredEmail(email);
        navigate('/onboarding');
      } catch (err) {
        setError(t('auth.callbackError'));
      }
    };

    run();
  }, [navigate, searchParams, t]);

  return (
    <div className="mx-auto mt-32 max-w-lg rounded-3xl bg-white/10 p-8 text-white shadow-glass">
      <h1 className="text-2xl font-semibold">{t('auth.verifying')}</h1>
      {error ? (
        <p className="mt-4 text-rose-200">{error}</p>
      ) : (
        <p className="mt-4 text-white/70">{t('auth.success')}</p>
      )}
    </div>
  );
};

export default AuthCallback;
