# jtash-frontend

Personal site for Jay Tash / Alireza Jafartash. Production domain: `jtash.ir`.

## State

**Reset in `chore/reset-frontend`.** The previous portfolio was removed; this is a
fresh Next.js app that renders an empty page. Product work (routes, content,
branding) starts only when explicitly requested.

**Product brief:** [`context/README.md`](context/README.md) holds the portfolio's
decisions, layout, section specs and task slices. Read it before any product work.

Deploys are intentionally off: the `deploy-production` job in
`.forgejo/workflows/ci.yml` is gated on the repository variable
`ENABLE_VERCEL_DEPLOY=true`. Nothing reaches `jtash.ir` until that is set.

## Commands

```bash
bun install
bun run dev      # http://localhost:12000
bun run build
bun run start
bun run typecheck
bun run lint
```

Port **12000** is allocated to this project (ADR-006, client `n=2`).

## Stack

- Next.js 16 App Router, React 19, Tailwind 4, TypeScript 6, Biome 2
- `@manovaspace/ui` primitives, `@manovaspace/tokens` semantic tokens
- Published npm versions of `@manovaspace/*` (no `link:` deps) so CI runners work

## Structure

| Path | Role |
|------|------|
| `src/app/layout.tsx` | Root document, metadata, provider stack |
| `src/app/page.tsx` | Home route (currently empty) |
| `src/app/globals.css` | Tailwind wiring + token-to-utility mapping |
| `src/components/providers.tsx` | TokenProvider → ThemeProvider → ThemeColorSync → Toaster |

## Conventions

- Import UI from `@manovaspace/ui` only. Never `lucide-react`, `react-icons`, Radix
  primitives, or `packages/ui/src/primitives`.
- Product/domain components live in `src/components/`; anything reusable belongs in
  the design system.
- One `Toaster` per app (already mounted in `providers.tsx`). Use `toast()` for
  transient feedback, `Dialog` for reversible flows, `AlertDialog` for confirmations.
- Internal navigation uses `next/link`.
- Copy lives in content/data files, never hardcoded in components.
- Asset references must point at files that exist in `public/` or `src/`.

## CSS import order (do not reorder)

`@manovaspace/ui/styles.css` is a **precompiled Tailwind sheet**. Import it before
`tailwindcss`, otherwise its base utilities (`.hidden`, `.md:*`) override the app's
responsive variants and every `sm:`/`lg:`/`xl:` class silently stops working.

Tokens are full color values. Never redefine `--background`-style variables as bare
HSL triplets; brand overrides go through `TokenProvider` / token files.
