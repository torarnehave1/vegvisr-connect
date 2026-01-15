# Vegvisr Onboarding

## Cloudflare Pages setup

1) Install dependencies
```bash
npm install
```

2) Create a D1 database and apply schema
```bash
wrangler d1 create vegvisr-onboarding
wrangler d1 execute vegvisr-onboarding --file=./schema.sql --remote
```

Then paste the generated `database_id` into `wrangler.toml` under `[[d1_databases]]`.

3) Configure environment variables

Non-sensitive values can live in `wrangler.toml` under `[vars]` (useful for local dev). For production, set them in Cloudflare Pages → Settings → Environment Variables. You will likely have different values for dev and production (for example, `PUBLIC_APP_URL`).

Vars (non-secret):
- `PUBLIC_APP_URL`
- `MAGIC_LINK_WEBHOOK_URL`
- `ONBOARDING_WEBHOOK_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_REDIRECT_URI`
- `GOOGLE_TOKEN_ENDPOINT`
- `GOOGLE_USERINFO_ENDPOINT`
- `OAUTH_EXCHANGE_URL`
- `CORS_ALLOWED_ORIGINS`

Secrets (sensitive):
- `VEGVISR_API_TOKEN`
- `GOOGLE_CLIENT_SECRET`

You can set secrets via CLI (Pages):
```bash
wrangler pages secret put VEGVISR_API_TOKEN
wrangler pages secret put GOOGLE_CLIENT_SECRET
```

Note: Wrangler v4 does not support `pages project set-env` and only supports secrets via CLI. For non-secret env vars, use the Pages dashboard or store the value as a secret instead.

Only set the secrets you actually use. For Google OAuth, ensure `GOOGLE_REDIRECT_URI` matches your Pages URL + `/auth/callback`.

Suggested URLs:
- Dev `PUBLIC_APP_URL`: `http://localhost:5173`
- Prod `PUBLIC_APP_URL`: `https://connect.vegvisr.org`
- Prod `CORS_ALLOWED_ORIGINS`: `https://connect.vegvisr.org`

4) Run locally
```bash
npm run dev
```

5) Build + deploy with Cloudflare Pages
- Connect the repo in Pages
- Build command: `npm run build`
- Build output directory: `dist`

## Dedicated API Worker (optional)

If you want a separate Worker instead of Pages Functions, use `connect-worker/`.

Deploy:
```bash
cd connect-worker
wrangler deploy
```

The frontend is currently hardcoded to call `https://connect-api.vegvisr.org`.

## Notes
- D1 schema is in `schema.sql`.
