---
read_with: []
---

# jtash-frontend

Personal site for Jay Tash / Alireza Jafartash. Production domain: `jtash.ir`.

One Astro app serves both parts: the portfolio at `/` and the notes blog at `/blog/`, with the RSS feed at `/rss.xml`.

## Stack

- Astro 7 with static output (`output: "static"`), `site: "https://jtash.ir"`, `trailingSlash: "always"`
- Portfolio: a React 19 island at `/` (`<PortfolioRoot client:only="react" />`). It is not server-rendered: its hooks read `matchMedia` and `localStorage` during render.
- Blog: MDX posts (`@astrojs/mdx`), React islands (`@astrojs/react`), RSS (`@astrojs/rss`), sitemap (`@astrojs/sitemap`)
- Tailwind CSS v4 through `@tailwindcss/vite`, portfolio only; theme tokens live in `src/index.css`
- Plain CSS with design tokens in `src/styles/blog.css`, blog only. No Tailwind on blog pages.
- Motion for animation: `import { motion } from "motion/react"`
- TypeScript in strict mode (`astro/tsconfigs/strict`), formatted with oxfmt
- bun 1.4.4 as package manager. Node 22 via `.mise.toml`.

## Commands

```bash
bun install
bun run dev          # http://localhost:10202
bun run build        # static build to dist/
bun run preview      # http://localhost:10202
bun run typecheck    # astro check
bun run format       # oxfmt
```

Port **10202** is allocated to this project in the workspace port registry (ADR-058).

## Structure

| Path | Role |
|------|------|
| `astro.config.mjs` | Site URL, static output, MDX, React, sitemap, Tailwind plugin, `@` alias |
| `src/pages/index.astro` | Portfolio route `/`; mounts `PortfolioRoot` as a `client:only` island |
| `src/PortfolioRoot.tsx` | Wraps `App` in `React.StrictMode` |
| `src/layouts/Portfolio.astro` | Portfolio HTML shell: head meta, favicon, noscript title; imports `src/index.css` |
| `src/App.tsx` | Page composition and active-section state |
| `src/SiteHeader.tsx` | Fixed navigation and section indicators |
| `src/Background.tsx` | Ambient animated background driven by the active pillar |
| `src/hero/` | Hero scene: terminal, mascot, rotating line, social links |
| `src/pillars/` | Pinned three-pillar scroll story and its animated scenes |
| `src/experience/` | Experience timeline plus `data.ts` |
| `src/education/` | Education section |
| `src/devtools/` | Temporary design-alternative panel and its context |
| `src/content.ts` | All portfolio copy and structured content |
| `src/content/resume.md` | Résumé source kept alongside the content layer |
| `src/index.css` | Tailwind import, `@theme` tokens, base styles (portfolio only) |
| `src/lib/` | Shared hooks, math helpers, and `posts.ts` (blog helpers) |
| `src/content.config.ts` | `posts` collection: glob `**/index.mdx`, id = folder slug |
| `src/content/posts/<slug>/` | One blog post: `index.mdx` plus colocated components and small images |
| `src/components/` | Components shared by several blog posts and `SectionProgressSquares.tsx` |
| `src/layouts/BlogBase.astro`, `src/layouts/BlogPost.astro` | Blog HTML shell and post chrome; import `src/styles/blog.css` |
| `src/styles/blog.css` | Blog tokens, prose, `.wrap`, `.wide`, reduced-motion rules |
| `src/pages/blog/index.astro` | Post index at `/blog/` |
| `src/pages/blog/[slug]/index.astro` | Post route at `/blog/<slug>/` |
| `src/pages/rss.xml.ts` | RSS feed at `/rss.xml` |
| `src/pages/404.astro` | Not found page |
| `public/` | Favicon and logo/icon assets served as-is |
| `plans/` | Design and implementation plan for the portfolio |
| `vercel.json` | Vercel Astro deployment settings |

## Conventions

- Copy and structured content belong in `src/content.ts` or the section's `data.ts`,
  not hardcoded inside components.
- Section-specific visuals stay in their section directory; reusable hooks go in `src/lib/`.
- Import Motion from `motion/react`.
- Asset references must point at files that exist in `public/`.
- Portfolio pages use `src/index.css` and Tailwind. Blog pages import only `src/styles/blog.css`; never import `src/index.css` into a blog layout.
- Do not add `@manovaspace/ui` or `@manovaspace/tokens` to this app: the visual
  language comes from this repository's own Tailwind theme and blog CSS.
- Keep feed titles, descriptions and dates in `/rss.xml` accurate.

## Writing a post

1. Create `src/content/posts/<slug>/index.mdx` with frontmatter:
   - `title` (string), `description` (string), `date` (YYYY-MM-DD)
   - `updated` (optional date), `tags` (list, default `[]`), `draft` (boolean, default `false`)
2. Components the post needs go next to it as `.tsx` files in the same folder. Import them relatively, e.g. `import Chart from './Chart.tsx'`.
3. Interactive components need a `client:` directive. Use `client:visible` by default.
4. Components shared by several posts go in `src/components/`.
5. Small images live in the post folder.
6. Video and large media go to the R2 bucket, never git.
7. Blog styles are plain CSS in `src/styles/blog.css`, using its tokens. No Tailwind on blog pages.

Conventions:

- Every interactive figure must respect `prefers-reduced-motion` and work at 390px width.
- Use the `.wide` class on a wrapper to let a figure be wider than the text column.
- Drafts (`draft: true`) show in `bun run dev` and are excluded from `bun run build`.
- A post is served at `/blog/<slug>/` and listed in `/rss.xml` and `sitemap-index.xml`.

## Deploy

Vercel builds with `bun run build` and serves `dist/` (`framework: "astro"`). `.github/workflows/deploy.yml`
deploys every push to `main` with its own build and does not wait for CI (ADR-076). The
`deploy-production` job stays gated on the repository variable `ENABLE_VERCEL_DEPLOY=true`,
so nothing reaches `jtash.ir` until that is set. `.github/workflows/ci.yml` runs on release
and Renovate pull requests and manual runs only.

<!-- manova:conventions v1 — generated from manovaspace/ci conventions/core.md; edit it there -->
## Shared conventions

These rules apply to every Manova repository. They are copied from `manovaspace/ci` (`conventions/core.md`); change them there, not here.

### Delivery

1. Never push to `main`. Every change goes on a topic branch (`feat/<name>`, `fix/<name>`, `refactor/<name>`, `docs/<name>`, `chore/<name>`) and reaches `main` through a pull request.
2. One pull request does one thing. An unrelated problem you find on the way becomes an issue, not part of this change.
3. Pull request titles and commit messages follow Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`; `!` for a breaking change). Releases are computed from them.
4. Merge with squash once the checks are green. Do not use `--no-verify`; if you ever must, say so in the pull request.

### Checks

5. CI runs `manovaspace/ci@v1`. Run the same gate locally before you push; a red check is fixed, not skipped.
6. Tool versions (Go, Node, Bun, linters) come from `ci/versions.env` in `manovaspace/ci`. Do not pin a different version in this repository.
7. A behaviour change comes with a test that fails without it. Do not delete or weaken a test to make a change pass.

### Secrets

8. Never commit a secret, token, password, private key or `.env` file. Commit `.env.example` with placeholders instead.
9. Never print a secret in logs, test output, error messages or pull requests. Read secrets from the environment or a file at run time.

### Runtime

10. Containers talk to each other by name on a Docker network. Do not publish a port on the host unless a person or a host process needs it, and then bind `127.0.0.1`, never `0.0.0.0`.
11. Configuration comes from the environment. A service with a missing required setting refuses to start; it never falls back to a built-in secret or a development default in production.
12. Port numbers come from the workspace port registry. Do not invent a port.

### Documentation

13. This repository explains itself: `README.md` says how to set up, run, test and deploy it; `AGENTS.md` holds its binding rules; repository decisions live in `docs/decisions/`.
14. Write plain, short sentences. Keep exact names, paths, commands and versions. Do not document what the code already says.
<!-- /manova:conventions -->
