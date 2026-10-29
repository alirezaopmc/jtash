# 07 — Implementation guide

## Stack (already in the repo)

Next.js 16 App Router · React 19 · Tailwind 4 · TypeScript · Biome · `@manovaspace/ui` ·
`@manovaspace/tokens`. Read [`../AGENTS.md`](../AGENTS.md) first: the CSS import order in
`globals.css`, the UI import rule (only `@manovaspace/ui`, no `lucide-react`/Radix directly) and
"copy lives in content files" are binding.

## Proposed files

```
src/app/layout.tsx                    # mounts <Shell> around {children}
src/app/page.tsx                      # neutral view  → <ViewPage view="neutral" />
src/app/hire/page.tsx                 # hire view     → <ViewPage view="hire" />
src/app/casual/page.tsx               # casual view   → <ViewPage view="casual" />
src/app/not-found.tsx                 # E37: No such page
src/components/view-page.tsx          # orders sections for a view (Server Component)
src/components/sections/hero.tsx      # Server Component
src/components/shell/shell.tsx        # canvas padding + statusline slot
src/components/shell/statusline.tsx   # client: section tracking, clock, position
src/components/shell/command-line.tsx # client: dialog + combobox
src/components/shell/keymap.ts        # client: key handling, guarded for inputs
src/components/shell/commands.ts      # command table (data + actions)
src/content/profile.ts                # name, valueLine per view, contacts
src/content/sections.ts               # section ids, labels, order per view
```

Keep Server Components by default; only the statusline, command line and keymap are client code.
Fonts: JetBrains Mono for chrome via `@fontsource/jetbrains-mono` (self-hosted, `display: swap`),
400/500/700 to match the reference site;
content stays on the system proportional stack until the pairing is chosen.

## Theme

`providers.tsx` forces dark with the Claude Code palette. Two files own it:

- `src/theme/claude-code.ts` — the authored (light) scheme, type families, radii; passed to
  `TokenProvider` so the tokens resolve through the shared layer.
- `src/theme/claude-code.css` — the dark surface stack under `html.dark`, because the token
  resolver derives dark by inverting lightness and flattens elevation.

`src/components/token-style.tsx` renders those variables server-side as the first child of `<body>`
so the first paint is already branded; `TokenProvider` updates that same node id at runtime.
Do not hard-code hex in components; add a token instead.

## View transitions

Switching `/` ↔ `/hire` ↔ `/casual` should animate the reorder where supported. Check whether the
installed Next/React versions expose View Transitions (Next `experimental.viewTransition` with
React's `ViewTransition`). If not available or unstable, ship without the animation; do not add a
motion library for this.

## Task slices (do in order, one PR each)

1. **Shell skeleton** — routes `/`, `/hire`, `/casual`, `not-found`; `Shell` with the static
   statusline (mode links, buffer path for the hero, command hint, position); content files; light theme.
2. **Hero** — per [06-hero.md](06-hero.md) and its acceptance list.
3. **Command line** — dialog/combobox, v1 command table, output line, `:help`.
4. **Keymap and section tracking** — `j`/`k`/`gg`/`G`/`?`, IntersectionObserver for buffer path
   and position, presence segment once the owner picks Slack-style or status-page style.

Stop after each slice and show the owner (screenshots at 375 and 1440). Do not start the next
section from [08](08-roadmap.md) unasked.

## Verify before calling a slice done

```bash
bun run typecheck
bun run lint
bun run build
bun run dev   # http://localhost:12000
```

Browser checks (workspace `playwright-cli`, see handbook `frontend-agent-workflow`):
320 / 375 / 1440px, keyboard only (Tab through statusline, open/close command line, focus returns),
reduced motion, no console errors. For taste checks run the `design-taste-frontend` inspector
against `http://localhost:12000`; it needs `CHROME_PATH` pointed at Playwright's Chromium on hosts
without Chrome. Add `.taste-skill/` to `.gitignore` before the first run.

## Git

Tier 1 repo (ADR-026): no direct push to `main`. The reset and these context docs are merged into
local `main` (not pushed yet). Branch from `main` (`feat/shell-hero`), use Conventional Commits,
and open PRs with `o pr create`. Production deploys stay off (`ENABLE_VERCEL_DEPLOY`); do not enable them.
