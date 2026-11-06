---
read_with: []
---

# jtash-frontend

Personal site for Jay Tash / Alireza Jafartash. Production domain: `jtash.ir`.

The frontend is the portfolio exported from Figma Make: a Vite + React single-page
application. It replaced the previous Next.js shell.

## Stack

- Vite 8 with `@vitejs/plugin-react`
- React 19 and React DOM 19
- Tailwind CSS v4 through `@tailwindcss/vite`; theme tokens live in `src/index.css`
- Motion (`motion/react`) for animation
- TypeScript 5.7 in strict mode, formatted with oxfmt

## Commands

```bash
bun install
bun run dev          # http://localhost:12000
bun run build        # writes dist/
bun run preview      # http://localhost:12000
bun run typecheck    # tsc --noEmit
bun run format       # oxfmt
```

Port **12000** is allocated to this project (ADR-006, client `n=2`).

## Structure

| Path | Role |
|------|------|
| `src/main.tsx` | React entrypoint; imports `src/index.css` and mounts `App` into `#root` |
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
| `src/index.css` | Tailwind import, `@theme` tokens, base styles |
| `src/lib/` | Shared hooks and math helpers |
| `public/` | Favicon and logo/icon assets served as-is |
| `plans/` | Design and implementation plan for the portfolio |
| `.figma/` | Figma Make harness metadata and scripts |
| `vite.config.ts` | Vite config: React, Tailwind, Figma site metadata, `@` alias |
| `vercel.json` | Vercel Vite deployment settings |

## Conventions

- Copy and structured content belong in `src/content.ts` or the section's `data.ts`,
  not hardcoded inside components.
- Section-specific visuals stay in their section directory; reusable hooks go in `src/lib/`.
- Import Motion from `motion/react`.
- Asset references must point at files that exist in `public/`.
- Do not add `@manovaspace/ui` or `@manovaspace/tokens` to this app: the visual
  language comes from the Figma Make export and its own Tailwind theme.
- `.figma/` is synced from Figma Make; do not hand-edit its scripts.

## Deploy

Vercel builds with `bun run build` and serves `dist/`. GitHub Actions runs the
same install, typecheck, and build. The `deploy-production` job stays gated on
the repository variable `ENABLE_VERCEL_DEPLOY=true`, so nothing reaches
`jtash.ir` until that is set.
