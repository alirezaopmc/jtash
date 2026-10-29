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
Fonts via `next/font` (self-hosted, `display: swap`), exposed as CSS variables.

## Theme

`providers.tsx` currently uses `defaultTheme="system"`. The hero must be flat white, so set the
theme to light (no system switching) until `:set bg=dark` is built. Accent and greys go through the
token layer, not hard-coded hex.

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
