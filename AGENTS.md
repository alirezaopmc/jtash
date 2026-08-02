# jtash-frontend

Personal portfolio site for Jay Tash / Alireza Jafartash. Hostname-aware branding (`jtash.ir` vs default) without locale routing.

## Commands

```bash
pnpm install
pnpm dev      # http://localhost:12000
pnpm build
pnpm start
pnpm typecheck
pnpm lint
```

Dev server runs on **port 12000**.

## Stack

- Next.js 16 (App Router, no `next-intl`, no `[locale]` segment)
- `@manovaspace/ui` primitives, `@manovaspace/markdown` for blog content
- Local JSON content under `src/content/data/`
- Hostname resolution via `getRequestSiteContent()` (`headers().get('host')`)

## Packages

`package.json` today:

- `@manovaspace/tokens` / `@manovaspace/ui` → `link:` into `manovaspace/design-system`
- `@manovaspace/markdown` → **npm** (`^0.1.2`), not `link:`

No `@orbit/*` dependencies in this package.

Build linked packages first if types or dist are missing:

```bash
cd ../../../manovaspace/design-system && pnpm install && pnpm --filter @manovaspace/tokens --filter @manovaspace/ui build
```

## Structure

| Path | Role |
|------|------|
| `src/types/content.ts` | Content TypeScript types |
| `src/content/data/*.json` | Site copy and fixtures |
| `src/content/repository/` | Content access (`getSiteContent`, blog, projects) |
| `src/content/services/` | `resolveSiteContentForHost`, display-name helpers |
| `src/components/` | Layout, sections, story, blog, projects |
| `src/styles/jtash.css` | Theme tokens, story bands, textures |
| `src/lib/get-request-site-content.ts` | Per-request host → content |
