import { useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import AuthCallback from './pages/AuthCallback';
import AuthVerify from './pages/AuthVerify';
import Onboarding from './pages/Onboarding';
import { LanguageContext } from './lib/LanguageContext';
import { getStoredLanguage, setStoredLanguage } from './lib/storage';
import { applyBrandingTheme, type BrandingConfig } from './lib/branding';

const App = () => {
  const [language, setLanguageState] = useState(getStoredLanguage());
  const location = useLocation();
  const [branding, setBranding] = useState<BrandingConfig | null>(null);

  const setLanguage = (value: typeof language) => {
    setLanguageState(value);
    setStoredLanguage(value);
  };

  const contextValue = useMemo(
    () => ({ language, setLanguage }),
    [language]
  );

  const hideHeader = ['/auth/callback', '/auth/verify'].includes(location.pathname);

  const setFavicon = (href: string) => {
    if (!href) return;
    const url = new URL(href, window.location.origin);
    url.searchParams.set('v', Date.now().toString());
    let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = url.toString();
  };

  const setTabTitle = (title: string) => {
    if (!title) return;
    document.title = title;
  };

  useEffect(() => {
    let isMounted = true;
    const loadBranding = async () => {
      try {
        const response = await fetch(`/branding.json?ts=${Date.now()}`, { cache: 'no-store' });
        const data = await response.json();
        if (!response.ok) return;
        if (!isMounted) return;
        setBranding(data);
        applyBrandingTheme(data);
        const fallbackTitle = data?.brand?.name || 'Vegvisr Connect';
        setTabTitle(data?.meta?.title || fallbackTitle);
        if (data?.meta?.faviconUrl) {
          setFavicon(data.meta.faviconUrl);
        }
      } catch {
        // ignore branding errors
      }
    };
    loadBranding();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <LanguageContext.Provider value={contextValue}>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--brand-bg-base)' }}>
        <div className="absolute inset-0 brand-background" />
        <div className="relative z-10 min-h-screen">
          {!hideHeader && (
            <Header
              language={language}
              onLanguageChange={setLanguage}
              logoUrl={branding?.brand?.logoUrl}
              slogan={branding?.brand?.slogan}
            />
          )}
          <main className="px-6 pb-16">
            <Routes>
              <Route path="/" element={<Home branding={branding} />} />
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
