# jtash-frontend

Personal portfolio site for Jay Tash / Alireza Jafartash. Hostname-aware branding (`jtash.ir` vs default) without locale routing.

## Commands

```bash
bun install
bun run dev      # http://localhost:12000
bun run build
bun run start
bun run typecheck
bun run lint
```

Dev server runs on **port 12000**.

## Stack

- Next.js 16 (App Router, no `next-intl`, no `[locale]` segment)
- `@manovaspace/ui` primitives, `@manovaspace/markdown` for blog content
- Local JSON content under `src/content/data/`
- Hostname resolution via `getRequestSiteContent()` (`headers().get('host')`)

## Packages

`package.json` today:

- `@manovaspace/tokens` / `@manovaspace/ui` → published npm packages, resolved by the declared semver ranges
- `@manovaspace/markdown` → published npm package (`^0.1.2`)

No `@orbit/*` dependencies in this package.

The frontend installs only published packages and has no workspace dependencies on sibling repositories.

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

## Component ownership

Import primitives from `@manovaspace/ui` only — not `lucide-react`, `react-icons`, or Radix directly. Icons from `@manovaspace/ui` (brand icons from `@manovaspace/ui/icons/brand`). Motion helpers from `@manovaspace/ui/motion`; use `framer-motion` directly only for product-specific choreography in story/timeline sections.

| Kind | Where | Examples in this repo |
| --- | --- | --- |
| **Base / primitive** | `@manovaspace/ui` | `Button`, `Dialog`, `Badge`, `Card`, `toast`, `Toaster`, `ThemeProvider` |
| **Product / domain** | `src/components/` | `ExternalResourceModal`, `WhatsNewAnnouncement`, story/timeline sections, hostname-aware layout |

Quick check: *Would another client use this unchanged?* Yes → `@manovaspace/ui`. No → keep it here; do not add portfolio-specific UI to the design-system package.

## Provider order

`ThemeProvider` → `ThemeColorSync` / `SystemThemeSync` → `Toaster` → `ExternalLinkProvider` → layout chrome → pages

Wired in `src/components/layout/site-shell.tsx`. Hostname branding stays in `resolveSiteContentForHost` and `jtash.css` — not `TokenProvider` / `theme.json`.

## Toast and modal conventions

- Mount a single `<Toaster />` in `site-shell` (inside `ThemeProvider`).
- **Transient feedback** (copy, save, async success/error): `toast({ title, variant: "success" | "destructive" | "default" })` from `@manovaspace/ui`. Copy strings from `labels` / `ui-labels.json`.
- **Rich or blocking flows** (external link profiles, release notes): shared `Dialog` + `Button` in product components (`external-resource-modal.tsx`, `whats-new-announcement.tsx`). Keep existing motion, dark-theme, and dialog layout; do not replace with `AlertDialog` unless the flow is confirm-only.
- Do not add parallel toast systems or raw Radix dialog primitives in this repo.
