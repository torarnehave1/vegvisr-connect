# Shared Components Strategy (React + Vite + Cloudflare Pages)

## Goal
Reuse core UI components (language selector, buttons, layout, branding hooks) across multiple React apps while keeping each Cloudflare Pages repo lightweight.

## Why this matters
- Consistent UX across apps
- Faster iteration (fix once, roll out everywhere)
- Avoid copy‑paste drift

## Options

### Option 1 — Shared UI Kit as a package (recommended)
Create a repo like `vegvisr-ui-kit` and publish it as a private npm package.

Pros:
- Clean versioning and updates
- Apps stay small and focused
- Easy to enforce consistency

Cons:
- Requires package publishing
- Slight overhead to maintain versions

### Option 2 — Git submodule
Keep a `ui-kit/` folder as a submodule in each repo.

Pros:
- No package publishing
- Direct control from Git

Cons:
- Submodules are harder to manage
- Updates require extra Git steps

### Option 3 — Copy‑template per repo
Copy a starter UI kit into each repo and update manually.

Pros:
- Very simple setup
- No extra tooling

Cons:
- Drift over time
- Harder to keep consistent

## Recommended baseline
Start with **Option 1** (private npm package). If that’s too heavy now, use Option 3 as a temporary step, then migrate to Option 1 later.

## What goes into the shared UI kit
- `LanguageProvider`, `LanguageSelector` (dropdown)
- `useTranslation` + translation helpers
- Base UI components (Button, Input, Card, Modal)
- Tailwind tokens + CSS variables
- `useBranding` hook (domain branding + KV)

## Suggested structure
```
vegvisr-ui-kit/
  src/
    components/
    hooks/
    i18n/
    styles/
  package.json
```

## Branding integration (key)
- Read `x-original-hostname` from `brand-worker` via a `HEAD` request
- Fetch branding from `main-worker`: `GET /site-config/<domain>`
- Apply branding tokens before first paint

## API client shared module
Put common fetch logic in a tiny `api-client`:
- Base URL config
- Standard headers
- Error handling

## Deployment flow
1. Update `vegvisr-ui-kit`
2. Publish new version
3. Bump version in each Pages repo
4. Redeploy Pages apps

## Quick decision checklist
- Do you want strict versioning? → Option 1
- Do you want quick local edits? → Option 3
- Do you want central control without npm? → Option 2
