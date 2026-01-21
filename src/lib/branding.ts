export type BrandingConfig = {
  brand?: {
    name?: string;
    logoUrl?: string;
    slogan?: string;
  };
  theme?: {
    background?: {
      base?: string;
      radialTop?: string;
      radialBottom?: string;
      points?: Array<{ id: string; x: number; y: number; color: string }>;
    };
    text?: {
      primary?: string;
      muted?: string;
      headlineGradient?: [string, string];
    };
    card?: {
      bg?: string;
      border?: string;
    };
    button?: {
      bgGradient?: [string, string];
      text?: string;
    };
  };
  copy?: {
    badge?: string;
    headline?: string;
    subheadline?: string;
    emailLabel?: string;
    emailPlaceholder?: string;
    cta?: string;
  };
  language?: {
    default?: string;
  };
  layout?: {
    showLanguageToggle?: boolean;
  };
};

export const applyBrandingTheme = (branding?: BrandingConfig | null) => {
  if (!branding?.theme) return;
  const root = document.documentElement;
  const theme = branding.theme;
  const gradient = theme.text?.headlineGradient;
  const buttonGradient = theme.button?.bgGradient;
  const points = theme.background?.points;

  if (points && points.length > 0) {
    const gradientValue = points
      .map(
        (point) =>
          `radial-gradient(circle at ${point.x}% ${point.y}%, ${point.color} 0%, transparent 60%)`
      )
      .join(', ');
    root.style.setProperty('--brand-bg-gradient', gradientValue);
  } else {
    if (theme.background?.base) {
      root.style.setProperty('--brand-bg-base', theme.background.base);
    }
    if (theme.background?.radialTop) {
      root.style.setProperty('--brand-bg-top', theme.background.radialTop);
    }
    if (theme.background?.radialBottom) {
      root.style.setProperty('--brand-bg-bottom', theme.background.radialBottom);
    }
  }
  if (theme.text?.primary) {
    root.style.setProperty('--brand-text-primary', theme.text.primary);
  }
  if (theme.text?.muted) {
    root.style.setProperty('--brand-text-muted', theme.text.muted);
  }
  if (gradient?.[0]) {
    root.style.setProperty('--brand-gradient-start', gradient[0]);
  }
  if (gradient?.[1]) {
    root.style.setProperty('--brand-gradient-end', gradient[1]);
  }
  if (theme.card?.bg) {
    root.style.setProperty('--brand-card-bg', theme.card.bg);
  }
  if (theme.card?.border) {
    root.style.setProperty('--brand-card-border', theme.card.border);
  }
  if (buttonGradient?.[0]) {
    root.style.setProperty('--brand-btn-start', buttonGradient[0]);
  }
  if (buttonGradient?.[1]) {
    root.style.setProperty('--brand-btn-end', buttonGradient[1]);
  }
  if (theme.button?.text) {
    root.style.setProperty('--brand-btn-text', theme.button.text);
  }
};
