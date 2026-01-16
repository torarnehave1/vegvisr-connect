# Vue to React UX/UI Migration Plan

## Goal
Move the current Vue UX/UI into React with shared styling patterns and a clean, lightweight architecture that can be split into separate Cloudflare Pages apps and separate repos.

## Guiding principles
- Keep UI consistent across apps with a shared design system.
- Prefer small, focused Pages projects with minimal build surface.
- Avoid duplicated business logic; share only what is stable.
- Ship in slices that keep production stable.
- All new apps must support white-label branding (easy domain + identity switch).

## Phase 0 — Inventory and baselines
1. Audit the existing Vue app: routes, components, layout, and any UI states.
2. Capture the current visual system: typography, spacing, colors, components.
3. Identify API dependencies and environment variables.
4. Define the target React apps and their boundaries (what goes where).
5. Review existing branding pages/workers in `vegvisr-frontend` to extract the current white-label model.

Deliverables:
- Component map (Vue → React equivalents).
- Route map.
- API/ENV inventory.
- Branding/white-label configuration notes.
- Branding system reference (KV schema + worker endpoints + frontend hooks).

## Phase 1 — Design system extraction
1. Extract the design tokens (colors, type scale, spacing, radii, shadows).
2. Create a minimal component kit in React (buttons, inputs, cards, forms).
3. Document usage patterns and states.
4. Add branding overrides (logo, colors, typography, domain-specific content).
5. Define branding data contract based on the current system:
   - KV keys: `site-config:<domain>`, `phone-mapping:<phone>`, `brand-user:<domain>:<phone>`, `brand-invite:<code>`
   - Branding fields: `branding.myLogo`, `branding.siteTitle`, `branding.slogan`, `branding.mySiteFrontPage`, `branding.menuConfig`, `branding.contentFilter`
   - Default logo API: `GET /main-logo` (from `main-worker`)

Deliverables:
- `ui-kit` (private package or copyable template).
- Token file (CSS variables + Tailwind config).
- Component usage guide.
- Branding tokens + override spec.
- Branding data contract (KV + APIs + required fields).

## Phase 2 — React app scaffolding
1. Create a base React template repo with Vite + Tailwind + routing.
2. Add shared tooling: linting, formatting, CI checks.
3. Add a baseline layout to match the Vue UI.
4. Add a branding loader (host-based or env-based) to apply white-label settings.
5. Mirror the current flow used in Vue:
   - Read `x-original-hostname` (set by `brand-worker`) to detect custom domains.
   - Fetch `GET /site-config/<domain>` from the branding API (current `main-worker`).
   - Apply branding overrides before first paint.

Deliverables:
- `react-app-template` repo.
- First Pages project configured and deployable.
- Branding-aware app shell.

## Phase 3 — Incremental migration (route by route)
1. Migrate the most self-contained views first.
2. Recreate complex views with parity tests (visual/behavioral).
3. Replace Vue routes with React routes in production via staged cutover.

Deliverables:
- React versions of core routes.
- Acceptance checklist per route.

## Phase 4 — Split into multiple Pages apps
1. Decide boundary rules (e.g., onboarding, account, marketing).
2. Create separate repos for each Pages app.
3. Share the design system via a package or subtree.
4. Configure per-app env vars and domains.

Deliverables:
- Separate repos (one per app).
- Separate Pages deployments.
- Consistent UI across apps.

## Phase 5 — Hardening and cleanup
1. Remove Vue dependencies and unused assets.
2. Normalize API clients and error handling.
3. Add smoke tests for critical flows.

Deliverables:
- Clean, React-only UI layer.
- Simplified dependency graph.

## Suggested repo structure
- `vegvisr-ui-kit` (shared tokens + base components)
- `vegvisr-connect` (onboarding/auth)
- `vegvisr-marketing` (public pages)
- `vegvisr-app` (main app views)

## Deployment strategy
- Each repo deploys to its own Cloudflare Pages project.
- Shared UI kit published as a package or copied via template.
- Common env var naming across projects.
- Branding configuration sourced per domain (env, JSON, or worker-backed).
- Custom domains should route through `brand-worker` (or equivalent proxy) to inject `x-original-hostname`.

## Risks and mitigations
- **UI drift:** enforce shared tokens + component kit.
- **Duplicated logic:** isolate shared logic in a small library.
- **Inconsistent auth flows:** centralize auth endpoints and keep UX consistent.

## Acceptance criteria
- Core routes visually match the Vue version.
- All critical flows tested end-to-end.
- Each Pages app deploys independently with correct env vars.
