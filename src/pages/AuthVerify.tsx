import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyMagicLink } from '../lib/api';
import { useLanguage } from '../lib/LanguageContext';
import { useTranslation } from '../lib/useTranslation';
import { setStoredEmail } from '../lib/storage';

const AuthVerify = () => {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError(t('auth.failure'));
      return;
    }

    const run = async () => {
      try {
        const { email } = await verifyMagicLink(token);
        setStoredEmail(email);
        navigate('/onboarding');
      } catch (err) {
        const message = err instanceof Error ? err.message : '';
        setError(message || t('auth.failure'));
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

export default AuthVerify;
