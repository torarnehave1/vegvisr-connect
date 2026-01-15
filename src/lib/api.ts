export type ProgressPayload = {
  step: number;
  data: Record<string, unknown>;
};

const getErrorMessage = async (response: Response, fallback: string) => {
  try {
    const payload = (await response.json()) as { error?: string; message?: string };
    return payload.error || payload.message || fallback;
  } catch {
    try {
      const text = await response.text();
      return text || fallback;
    } catch {
      return fallback;
    }
  }
};

export const requestMagicLink = async (email: string) => {
  const response = await fetch('/api/magic-link/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Magic link failed'));
  }
};

export const verifyMagicLink = async (token: string) => {
  const response = await fetch('/api/magic-link/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Magic link invalid'));
  }
  return (await response.json()) as { email: string };
};

export const getGoogleRedirectUrl = async () => {
  const response = await fetch('/api/oauth/google/redirect_url');
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'OAuth unavailable'));
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
    throw new Error(await getErrorMessage(response, 'OAuth exchange failed'));
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
    throw new Error(await getErrorMessage(response, 'Progress save failed'));
  }
};

export const loadProgress = async (email: string) => {
  const response = await fetch('/api/onboarding/progress/get', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Progress load failed'));
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
    throw new Error(await getErrorMessage(response, 'Submission failed'));
  }
};
