export type ProgressPayload = {
  step: number;
  data: Record<string, unknown>;
};

export const requestMagicLink = async (email: string) => {
  const response = await fetch('/api/magic-link/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!response.ok) {
    throw new Error('Magic link failed');
  }
};

export const verifyMagicLink = async (token: string) => {
  const response = await fetch('/api/magic-link/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  if (!response.ok) {
    throw new Error('Magic link invalid');
  }
  return (await response.json()) as { email: string };
};

export const getGoogleRedirectUrl = async () => {
  const response = await fetch('/api/oauth/google/redirect_url');
  if (!response.ok) {
    throw new Error('OAuth unavailable');
  }
  return (await response.json()) as { url: string };
};

export const exchangeOAuthCode = async (code: string) => {
  const response = await fetch('/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });
  if (!response.ok) {
    throw new Error('OAuth exchange failed');
  }
  return (await response.json()) as { email: string };
};

export const saveProgress = async (email: string, payload: ProgressPayload) => {
  const response = await fetch('/api/onboarding/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, ...payload })
  });
  if (!response.ok) {
    throw new Error('Progress save failed');
  }
};

export const loadProgress = async (email: string) => {
  const response = await fetch('/api/onboarding/progress/get', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!response.ok) {
    throw new Error('Progress load failed');
  }
  return (await response.json()) as { step: number; data: Record<string, unknown> } | null;
};

export const submitOnboarding = async (email: string, data: Record<string, unknown>) => {
  const response = await fetch('/api/onboarding', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, data })
  });
  if (!response.ok) {
    throw new Error('Submission failed');
  }
};
