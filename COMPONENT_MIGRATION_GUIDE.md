# Component/View Migration Guide (vegvisr-frontend Vue -> React repo)

## Goal
Move a single component or view from `vegvisr-frontend` into a new, lightweight repo while preserving behavior, styling, and required APIs.

## Preconditions
- Source file(s) identified in `vegvisr-frontend` (Vue).
- Target repo created (React).
- Deployment target decided (Cloudflare Pages + independent Workers).
- Git workflow decided (create repo locally first or clone an existing remote).

## Step 1 — Scope the migration
1. Identify the source view/component and its route.
2. List direct dependencies:
   - child components
   - composables/hooks
   - stores/state
   - API calls
   - assets (images, icons, fonts)
   - translations
3. Decide what to include:
   - keep as-is
   - replace with simplified equivalents
   - remove (if not needed)

Deliverable: a dependency checklist.

## Step 1.1 — Git workflow (local vs remote)
Choose one approach before you start:

Option A — Local first
1. `git init` in the new folder.
2. Build the app structure and commit locally.
3. Create the remote repo (GitHub).
4. Add `origin` and push.

Option B — Remote first
1. Create the GitHub repo first.
2. `git clone` it locally.
3. Build the app structure and commit/push as you go.

Recommendation:
- Use **Remote first** for teams or shared visibility.
- Use **Local first** for private spikes or quick experiments.

## Step 2 — Vue to React translation
Recreate the view in React by mapping Vue patterns to React patterns:
- `data()` -> `useState`
- `computed` -> `useMemo`
- `watch` -> `useEffect`
- `methods` -> local functions
- `props` -> component props
- `emit` -> callback props
- `v-if`/`v-show` -> conditional render
- `v-for` -> `.map`
- `v-model` -> controlled inputs
- Vue composables -> React hooks (custom or inline)

Tip: keep this minimal to reduce coupling.

## Step 2.1 — Create a Vite + React + Tailwind base (recommended)
From the new repo root:

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss postcss autoprefixer
```

Create Tailwind config manually (Tailwind v4 CLI no longer generates config):

```bash
cat > tailwind.config.js <<'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  plugins: []
};
EOF

cat > postcss.config.js <<'EOF'
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {}
  }
};
EOF
```

Update `tailwind.config.js` if needed:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  plugins: []
}
```

Replace `src/index.css` with Tailwind import:
```css
@import "tailwindcss";
```

Then start dev:
```bash
npm run dev
```

## Step 3 — Rebuild the route (React)
1. Add the route in React Router.
2. Map Vue route params/query to `useParams`/`useSearchParams`.
3. Provide mocked/stubbed data if APIs are not ready yet.

Deliverable: the component renders with dummy data.

## Step 4 — Wire APIs and env vars (Pages + Workers)
vegvisr-frontend uses Cloudflare Pages for hosting and **independent Workers** for APIs (no Pages Functions).

1. Map API endpoints to the appropriate Worker URLs.
2. Define required env vars and secrets in the Worker config (not Pages Functions).
3. Add a single `api.ts`/`api.js` wrapper in React to call those Workers.

Deliverable: live API calls work in dev.

## Step 5 — Branding compatibility (white-label)
1. Confirm how the component reads branding:
   - domain-based branding
   - default logos/themes
2. Ensure the new repo can load branding:
   - host detection
   - `/site-config/<domain>` fetch
3. Apply token overrides before first paint.

Deliverable: component respects branding.

## Step 6 — CSS strategy (Vue CSS -> Tailwind)
The Vue app uses custom CSS, but the new React apps should standardize on Tailwind.

Approach:
1. Extract core visual tokens from Vue (colors, type, spacing, radii, shadows).
2. Convert them into Tailwind tokens + CSS variables.
3. Rebuild UI components using Tailwind utility classes.
4. Keep a small shared set of React UI components.

Deliverable: Tailwind-based styles that match the Vue look.

## Step 7 — API delivery via Cloudflare Workers
The backend is already in Cloudflare Workers. Keep it centralized and stable.

Rules:
- React apps call Workers directly (no Pages Functions).
- Use a shared API base per app (env or constant).
- Keep Worker env/secret schemas consistent across repos.

Deliverable: API calls continue working after the migration.

## Step 8 — QA and parity check
1. Compare layout, content, and flows side-by-side.
2. Confirm key interactions still work.
3. Validate on mobile and desktop.

Deliverable: parity checklist signed off.

## Step 9 — Deploy and cut over
1. Deploy the new React repo to Cloudflare Pages.
2. Ensure Workers are deployed independently (no Pages Functions).
3. Connect domain/subdomain and update links/routing from the old Vue app.

Deliverable: production traffic uses the new app.

## Quick checklist (copy-paste)
- [ ] Source component identified
- [ ] Dependencies listed
- [ ] Translations copied
- [ ] Assets copied
- [ ] API wrapper added
- [ ] Env vars documented
- [ ] Branding applied
- [ ] Parity tested
- [ ] Pages deployed
- [ ] Links updated

## Notes
- Migrate one route at a time to minimize risk.
- Keep a rollback path (route toggle or DNS flip).
