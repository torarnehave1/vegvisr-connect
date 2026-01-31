import { useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import AuthCallback from './pages/AuthCallback';
import AuthVerify from './pages/AuthVerify';
import Onboarding from './pages/Onboarding';
import { LanguageContext } from './lib/LanguageContext';
import { applyBrandingTheme, type BrandingConfig } from './lib/branding';
import { setBrandingTranslations } from './lib/i18n';

const App = () => {
  const language = 'en';
  const location = useLocation();
  const [branding, setBranding] = useState<BrandingConfig | null>(null);

  const contextValue = useMemo(
    () => ({ language, setLanguage: () => {} }),
    [language]
  );

  const hideHeader = ['/auth/callback', '/auth/verify'].includes(location.pathname);

  const setFavicon = (href: string) => {
    if (!href) return;
    const url = new URL(href, window.location.origin);
    url.searchParams.set('v', Date.now().toString());
    const faviconHref = url.toString();

    // Remove all existing favicon links to avoid conflicts
    const existingIcons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
    existingIcons.forEach((el) => el.remove());

    // Create a single favicon link
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = faviconHref;
    document.head.appendChild(link);

    // Update apple touch icons
    const appleIcons = Array.from(
      document.querySelectorAll('link[rel="apple-touch-icon"]')
    ) as HTMLLinkElement[];
    appleIcons.forEach((appleLink) => {
      appleLink.href = faviconHref;
    });
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
        // Apply branding translations if available
        if (data?.translations) {
          setBrandingTranslations(data.translations);
        }
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
