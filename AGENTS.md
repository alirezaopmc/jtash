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

## Local packages

`package.json` links for development:

- `link:../../../manovaspace/design-system/packages/tokens`
- `link:../../../manovaspace/design-system/packages/ui`
- `link:../../../manovaspace/ts/packages/markdown`

Build linked packages first if types or dist are missing:

```bash
cd ../../../manovaspace/design-system && pnpm install && pnpm --filter @manovaspace/tokens --filter @manovaspace/ui build
cd ../../../manovaspace/ts && pnpm install && pnpm --filter @manovaspace/markdown build
```

## Verdaccio / `@orbit` registry

`.npmrc` points `@orbit` scoped packages at `https://npm.dev.manova.space`. For installs without `link:` overrides, set a token:

```bash
export NPM_TOKEN=your-verdaccio-token
```

The token is read from `//npm.dev.manova.space/:_authToken` (see `.npmrc` comment).

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
