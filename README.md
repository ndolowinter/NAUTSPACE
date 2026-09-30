# NautSpace International

Space systems, astrotourism, and national science center platform for **Space Exploration in Africa** (`orbitspacesafari.co.ke`).

## Stack

Next.js 14 (App Router) · TypeScript (strict) · Tailwind CSS · Supabase (Postgres + Auth + Storage) · Leaflet + Esri (keyless basemap tiles) · wagmi/viem (DAO governance mock)

## Getting started

```bash
npm install
npm approve-scripts --allow-scripts-pending   # allow native builds for esbuild, bufferutil, etc.
cp .env.example .env.local   # fill in Supabase keys
npx supabase link --project-ref <your-project-ref>
npx supabase db push          # applies supabase/migrations/*.sql
npm run dev
```

Don't run `npm run build` while `npm run dev` is running against the same checkout both write
to `.next/` and a production build will clobber the dev server's cached assets (symptom: the
page suddenly renders as unstyled black-on-white HTML). If that happens, stop the dev server,
delete `.next/`, and restart it.

The app renders without Supabase keys present `middleware.ts` no-ops the auth refresh instead
of throwing when Supabase env vars are missing, DB-backed lists fall back to static data, and
every form that writes to the database catches a missing-config error and shows an inline
message rather than crashing. The science-center map and executive telemetry map use Esri's
free, keyless basemap tiles, so they render with no configuration at all, Supabase or otherwise.
Forms (bookings, applications, DAO votes, partnership inquiries, sign-in) still need a real
Supabase project to actually persist anything the graceful-degradation only covers *rendering*
without keys, not writing data.

## Testing

```bash
npm run test        # Vitest pure-function unit tests (lib/classification.ts, lib/geo.ts, lib/utils.ts)
npm run test:watch  # same, in watch mode
npm run test:e2e    # Playwright public nav, executive-portal gate, client-side form validation
```

The Playwright suite runs against `npm run dev` on `localhost:3000` and does not require a
configured Supabase project it only asserts on client-side behavior (redirects, zod
validation) that doesn't depend on a real database write succeeding.

## Enrolling 2FA

`government`/`executive`/`admin` accounts are routed to `/auth/enroll-2fa` the first time they
hit `/executive/*` without `profiles.is_2fa_enabled` set. That page calls
`startTotpEnrollment()` (generates a secret, writes it to the profile, returns a QR code),
then `confirmTotpEnrollment(code)` verifies the user actually holds it before flipping
`is_2fa_enabled` to `true` a secret is written before it's confirmed so a dropped enrollment
doesn't silently brick account state, but the account only gains portal access once confirmed.

## Database

`supabase/migrations/0001_init.sql` creates `profiles`, `science_centers`,
`science_center_bookings`, `applications`, `partnership_inquiries`, `dao_proposals`, and
`dao_votes`, with RLS policies scoped by role (`student`, `researcher`, `partner`,
`government`, `executive`, `admin`) and a trigger that auto-creates a `profiles` row on signup.

`supabase/migrations/0002_storage.sql` provisions a private `resumes` bucket for the Careers
application flow objects are keyed by `${user.id}/...` and readable only by their owner or a
privileged role.

## Access control

- `src/middleware.ts` refreshes the Supabase session on every request and gates `/executive/*`
  behind: authenticated session → `government`/`executive`/`admin` role → 2FA enrolled → verified
  2FA this session (`osai_2fa_verified` cookie, set by `/auth/verify-2fa` after a TOTP check).
  It must live at `src/middleware.ts`, not the project root Next.js expects it next to `app/`
  when a `src/` directory is in use, and silently never loads it otherwise (no error, no warning,
  it just doesn't run this happened during development and produced a 500 instead of a redirect
  on `/executive/*` until it was caught by actually driving the app in a browser).
- `src/app/executive/layout.tsx` re-checks auth + role server-side as defense in depth, and now
  actually behaves like it: it catches errors from `createClient()` (e.g. missing Supabase env
  vars) and redirects to login instead of letting the page 500.
- 2FA is a real TOTP implementation (`otplib`) verified against `profiles.totp_secret_encrypted`.
  That column is *not* application-layer encrypted in this reference implementation wire it
  through Supabase Vault or a KMS envelope key before handling real secrets in production.

## Verified

As of the last pass, `npm run typecheck`, `npm run lint`, `npm run test` (17/17), `npm run build`,
and `npm run test:e2e` (10/10, run 3x for stability) all pass clean, and the app was driven in
real headless Chromium every public page plus the `/executive/*` login redirect with
screenshots checked by hand, not just asserted on. Bugs that only showed up once the code was
actually compiled/run (fixed, not just noted):

- `Database`'s entity types were declared as `interface`, not `type`. TypeScript's "any object
  type may satisfy `Record<string, unknown>`" leniency only applies to `type` aliases an
  `interface` is kept "open" for declaration merging and doesn't get it. That silently made
  every table's Row/Insert/Update resolve to `never` throughout the app (a cascade of ~15
  confusing errors from one root cause).
- `src/middleware.ts` was at the project root instead of inside `src/` Next.js never loaded it
  as a result, so `/executive/*` 500'd instead of redirecting (see Access control above).
- `Navbar`/`Hero` nested a `<Button>` inside a `<Link>`, i.e. `<button>` inside `<a>` invalid
  HTML that made the "Executive Portal" and hero CTA links unreliable to click programmatically.
  Fixed by exporting `buttonVariants` and styling the `<Link>` itself instead of wrapping a
  `<Button>`.
- `@supabase/ssr@0.4.1` (originally pinned) expects an old `@supabase/supabase-js` file layout;
  npm resolved `supabase-js` to a much newer major version whose build tooling changed, breaking
  `@supabase/ssr`'s internal type imports. Bumped `@supabase/ssr` to current (`0.12.3`).
- `wagmi/connectors`'s barrel export pulls in Coinbase's `baseAccount` connector, which
  transitively references `@x402/*` packages that were never published as resolvable deps (an
  optional payment feature this app doesn't use). `next.config.mjs` now ignores that whole scope
  via webpack's `IgnorePlugin`.
- A handful of `noUncheckedIndexedAccess`-driven strict-null issues in `ApplicationForm.tsx` and
  `WalletConnectButton.tsx`.

## Known gaps / next steps

This is a working foundation, not a fully staffed production build. Before shipping:

- **DAO governance treasury/vote figures are not read from a deployed contract.** wagmi/viem
  power wallet connection only; proposal votes live in Postgres (real writes, real RLS) and the
  multi-sig treasury balance/signer list in `TreasuryPanel.tsx` are static mock figures. This one
  can't be finished without an actual deployed Safe (or equivalent) wire `useReadContract`
  against a real treasury address when one exists.
- **Shadcn/UI primitives** are hand-written (`button`, `card`, `badge`, `input`) rather than
generated via the shadcn CLI run `npx shadcn-ui@latest add <component>` to pull in the rest
  of the kit (dialog, tabs, dropdown, etc.) as pages need them.
- Test coverage is a starting point, not exhaustive unit tests only cover the three pure
  functions that were worth extracting, and the Playwright suite deliberately avoids anything
  that needs a seeded Supabase project (real sign-in, an authenticated booking, an actual DAO
  vote). Add a seeded staging project + Playwright auth fixtures to close that gap.
- No real Supabase project is wired up yet see Deployment below for what's needed before forms
  actually persist data. The maps need no setup at all (Esri's keyless basemap tiles).

## CI/CD (Vercel)

1. **Repo → Vercel project**: import the repo in Vercel, framework preset "Next.js" (auto-detected).
2. **Environment variables**: mirror `.env.example` into the Vercel project (Production +
  Preview) at minimum `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY` (server-only, do not expose).
3. **Preview deployments**: every PR gets a Vercel preview URL automatically once the project is
   linked no extra config needed.
4. **GitHub Actions gate** (recommended, runs before Vercel builds anything expensive):
   ```yaml
   # .github/workflows/ci.yml
   name: CI
   on: [pull_request]
   jobs:
     verify:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with: { node-version: 20 }
         - run: npm ci
         - run: npm run lintT
         - run: npm run typecheck
         - run: npm run test
         - run: npm run build
         - run: npx playwright install --with-deps chromium
         - run: npm run test:e2e
   ```
5. **Supabase migrations**: run `supabase db push` from CI (or a manual step) against the
   staging project before promoting a deploy to production migrations are not applied
   automatically by Vercel.
6. **Domain**: point `orbitspacesafari.co.ke` at Vercel via the project's Domains settings once
   DNS is delegated.
Te