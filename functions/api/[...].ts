import { Hono } from 'hono';
import { z } from 'zod';

interface Env {
  DB: D1Database;
  MAGIC_LINK_WEBHOOK_URL: string;
  VEGVISR_API_TOKEN: string;
  PUBLIC_APP_URL: string;
  ONBOARDING_WEBHOOK_URL: string;
  ONBOARDING_EMAIL_ENDPOINT: string;
  ONBOARDING_EMAIL_RECIPIENT: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_REDIRECT_URI?: string;
  GOOGLE_TOKEN_ENDPOINT?: string;
  GOOGLE_USERINFO_ENDPOINT?: string;
  OAUTH_EXCHANGE_URL?: string;
  CORS_ALLOWED_ORIGINS?: string;
}

const app = new Hono<{ Bindings: Env }>();

const jsonHeaders = {
  'Content-Type': 'application/json'
};

const buildCorsHeaders = (origin: string) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  Vary: 'Origin'
});

app.use('*', async (c, next) => {
  const origin = c.req.header('Origin') || '*';
  const allowed = c.env.CORS_ALLOWED_ORIGINS;
  const isAllowed = !allowed || allowed.split(',').map((item) => item.trim()).includes(origin);
  const corsOrigin = isAllowed ? origin : 'null';

  if (c.req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: buildCorsHeaders(corsOrigin) });
  }

  await next();

  Object.entries(buildCorsHeaders(corsOrigin)).forEach(([key, value]) => {
    c.res.headers.set(key, value);
  });
});

const emailSchema = z.object({ email: z.string().email() });
const tokenSchema = z.object({ token: z.string().min(12) });

const logEvent = (event: string, data: Record<string, unknown>) => {
  console.log(JSON.stringify({ event, ...data }));
};

app.post('/api/magic-link/request', async (c) => {
  const body = await c.req.json();
  const parsed = emailSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: 'Invalid email' }, 400, jsonHeaders);
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  const createdAt = new Date().toISOString();

  await c.env.DB.prepare(
    'INSERT INTO magic_links (token, email, expires_at, created_at) VALUES (?, ?, ?, ?)'
  )
    .bind(token, parsed.data.email, expiresAt, createdAt)
    .run();

  const link = `${c.env.PUBLIC_APP_URL}/auth/verify?token=${token}`;

  if (c.env.MAGIC_LINK_WEBHOOK_URL) {
    await fetch(c.env.MAGIC_LINK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        ...jsonHeaders,
        Authorization: `Bearer ${c.env.VEGVISR_API_TOKEN}`
      },
      body: JSON.stringify({
        email: parsed.data.email,
        link,
        expiresAt
      })
    });
  }

  logEvent('magic_link_requested', { email: parsed.data.email });

  return c.json({ ok: true }, 200, jsonHeaders);
});

app.post('/api/magic-link/verify', async (c) => {
  const body = await c.req.json();
  const parsed = tokenSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: 'Invalid token' }, 400, jsonHeaders);
  }

  const now = new Date().toISOString();
  const record = await c.env.DB.prepare(
    'SELECT * FROM magic_links WHERE token = ? AND used_at IS NULL AND expires_at > ?'
  )
    .bind(parsed.data.token, now)
    .first();

  if (!record) {
    return c.json({ error: 'Token expired' }, 400, jsonHeaders);
  }

  await c.env.DB.prepare('UPDATE magic_links SET used_at = ? WHERE token = ?')
    .bind(now, parsed.data.token)
    .run();

  const sessionToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await c.env.DB.prepare(
    'INSERT INTO sessions (token, email, created_at, expires_at) VALUES (?, ?, ?, ?)'
  )
    .bind(sessionToken, record.email as string, now, expiresAt)
    .run();

  const cookie = `vegvisr_session=${sessionToken}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=${7 * 24 * 60 * 60}`;
  c.header('Set-Cookie', cookie);

  logEvent('magic_link_verified', { email: record.email });

  return c.json({ email: record.email }, 200, jsonHeaders);
});

app.get('/api/oauth/google/redirect_url', async (c) => {
  const clientId = c.env.GOOGLE_CLIENT_ID || '';
  const redirectUri = c.env.GOOGLE_REDIRECT_URI || `${c.env.PUBLIC_APP_URL}/auth/callback`;
  const scope = 'openid email profile';
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', scope);
  url.searchParams.set('access_type', 'offline');
  url.searchParams.set('prompt', 'consent');

  logEvent('oauth_redirect_url', { redirectUri });

  return c.json({ url: url.toString() }, 200, jsonHeaders);
});

app.post('/api/sessions', async (c) => {
  const body = await c.req.json();
  const code = z.string().min(1).safeParse(body.code);
  const emailInput = z.string().email().safeParse(body.email);

  if (emailInput.success) {
    logEvent('oauth_session_email', { email: emailInput.data });
    return c.json({ email: emailInput.data }, 200, jsonHeaders);
  }

  if (!code.success) {
    return c.json({ error: 'Missing code' }, 400, jsonHeaders);
  }

  let email = '';
  if (c.env.OAUTH_EXCHANGE_URL) {
    const response = await fetch(c.env.OAUTH_EXCHANGE_URL, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ code: code.data })
    });
    if (response.ok) {
      const payload = (await response.json()) as { email?: string };
      email = payload.email || '';
    }
  } else if (c.env.GOOGLE_TOKEN_ENDPOINT && c.env.GOOGLE_CLIENT_ID && c.env.GOOGLE_CLIENT_SECRET) {
    const tokenResponse = await fetch(c.env.GOOGLE_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: code.data,
        client_id: c.env.GOOGLE_CLIENT_ID,
        client_secret: c.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: c.env.GOOGLE_REDIRECT_URI || `${c.env.PUBLIC_APP_URL}/auth/callback`,
        grant_type: 'authorization_code'
      })
    });
    if (tokenResponse.ok && c.env.GOOGLE_USERINFO_ENDPOINT) {
      const tokenData = (await tokenResponse.json()) as { access_token?: string };
      if (tokenData.access_token) {
        const userResponse = await fetch(c.env.GOOGLE_USERINFO_ENDPOINT, {
          headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        if (userResponse.ok) {
          const user = (await userResponse.json()) as { email?: string };
          email = user.email || '';
        }
      }
    }
  }

  if (!email) {
    return c.json({ error: 'OAuth exchange failed' }, 400, jsonHeaders);
  }

  logEvent('oauth_session_created', { email });

  return c.json({ email }, 200, jsonHeaders);
});

app.post('/api/onboarding/progress', async (c) => {
  const body = await c.req.json();
  const parsed = z
    .object({
      email: z.string().email(),
      step: z.number().int().min(1).max(3),
      data: z.record(z.unknown())
    })
    .safeParse(body);

  if (!parsed.success) {
    return c.json({ error: 'Invalid progress payload' }, 400, jsonHeaders);
  }

  const now = new Date().toISOString();

  await c.env.DB.prepare(
    `INSERT INTO onboarding_progress (user_email, step, data_json, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(user_email) DO UPDATE SET step = excluded.step, data_json = excluded.data_json, updated_at = excluded.updated_at`
  )
    .bind(
      parsed.data.email,
      parsed.data.step,
      JSON.stringify(parsed.data.data),
      now
    )
    .run();

  logEvent('onboarding_progress_saved', { email: parsed.data.email, step: parsed.data.step });

  return c.json({ ok: true }, 200, jsonHeaders);
});

app.post('/api/onboarding/progress/get', async (c) => {
  const body = await c.req.json();
  const parsed = emailSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: 'Invalid email' }, 400, jsonHeaders);
  }

  const record = await c.env.DB.prepare(
    'SELECT step, data_json FROM onboarding_progress WHERE user_email = ?'
  )
    .bind(parsed.data.email)
    .first();

  if (!record) {
    return c.json(null, 200, jsonHeaders);
  }

  const data = record.data_json ? JSON.parse(record.data_json as string) : {};

  logEvent('onboarding_progress_loaded', { email: parsed.data.email });

  return c.json({ step: record.step, data }, 200, jsonHeaders);
});

app.post('/api/onboarding', async (c) => {
  const body = await c.req.json();
  const parsed = z
    .object({
      email: z.string().email(),
      data: z.record(z.unknown())
    })
    .safeParse(body);

  if (!parsed.success) {
    return c.json({ error: 'Invalid submission' }, 400, jsonHeaders);
  }

  const submittedAt = new Date().toISOString();

  await c.env.DB.prepare(
    'INSERT INTO onboarding_responses (user_email, data_json, submitted_at) VALUES (?, ?, ?)'
  )
    .bind(parsed.data.email, JSON.stringify(parsed.data.data), submittedAt)
    .run();

  await c.env.DB.prepare('DELETE FROM onboarding_progress WHERE user_email = ?')
    .bind(parsed.data.email)
    .run();

  if (c.env.ONBOARDING_WEBHOOK_URL) {
    await fetch(c.env.ONBOARDING_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        ...jsonHeaders,
        Authorization: `Bearer ${c.env.VEGVISR_API_TOKEN}`
      },
      body: JSON.stringify({
        email: parsed.data.email,
        submittedAt,
        data: parsed.data.data
      })
    });
  }

  if (c.env.ONBOARDING_EMAIL_ENDPOINT) {
    await fetch(c.env.ONBOARDING_EMAIL_ENDPOINT, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({
        to: c.env.ONBOARDING_EMAIL_RECIPIENT,
        subject: 'New Vegvisr onboarding',
        body: JSON.stringify({
          email: parsed.data.email,
          submittedAt,
          data: parsed.data.data
        })
      })
    });
  }

  logEvent('onboarding_submitted', { email: parsed.data.email });

  return c.json({ ok: true }, 200, jsonHeaders);
});

export const onRequest = app.fetch;
