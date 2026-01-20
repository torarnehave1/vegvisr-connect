import { useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import AuthCallback from './pages/AuthCallback';
import AuthVerify from './pages/AuthVerify';
import Onboarding from './pages/Onboarding';
import { LanguageContext } from './lib/LanguageContext';
import { getStoredLanguage, setStoredLanguage } from './lib/storage';

const App = () => {
  const [language, setLanguageState] = useState(getStoredLanguage());
  const location = useLocation();
  const [brandLogo, setBrandLogo] = useState<string | null>(null);
  const [brandSlogan, setBrandSlogan] = useState<string | null>(null);

  const setLanguage = (value: typeof language) => {
    setLanguageState(value);
    setStoredLanguage(value);
  };

  const contextValue = useMemo(
    () => ({ language, setLanguage }),
    [language]
  );

  const hideHeader = ['/auth/callback', '/auth/verify'].includes(location.pathname);
  const domainApiBase = import.meta.env.VITE_DOMAIN_API_BASE || '';

  useEffect(() => {
    let isMounted = true;
    const loadBranding = async () => {
      if (!domainApiBase) return;
      const hostname = window.location.hostname;
      try {
        const response = await fetch(
          `${domainApiBase}/custom-domain?domain=${encodeURIComponent(hostname)}`
        );
        const data = await response.json();
        if (!response.ok || !data?.success) return;
        if (!isMounted) return;
        setBrandLogo(data?.config?.logoUrl || null);
        setBrandSlogan(data?.config?.slogan || null);
      } catch {
        // ignore branding errors
      }
    };
    loadBranding();
    return () => {
      isMounted = false;
    };
  }, [domainApiBase]);

  return (
    <LanguageContext.Provider value={contextValue}>
      <div className="min-h-screen bg-[#0b1020]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(139,92,246,0.35),_transparent_55%)]" />
        <div className="relative z-10 min-h-screen">
          {!hideHeader && (
            <Header
              language={language}
              onLanguageChange={setLanguage}
              logoUrl={brandLogo}
              slogan={brandSlogan}
            />
          )}
          <main className="px-6 pb-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth/verify" element={<AuthVerify />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/onboarding/review" element={<Onboarding />} />
            </Routes>
          </main>
        </div>
      </div>
    </LanguageContext.Provider>
  );
};

export default App;
