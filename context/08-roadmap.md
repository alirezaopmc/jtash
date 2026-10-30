# 08 — Roadmap and open questions

## Sections

Build top to bottom, one per task, owner approval between each.

| # | Section | Status | Spec |
|---|---------|--------|------|
| 0 | Shell (statusline, command line, keymap) | statusline built ([task 01](tasks/01-shell-and-hero.md)); command line, keymap, section tracking next | [05](05-layout-shell.md) |
| 1 | Hero | built ([task 01](tasks/01-shell-and-hero.md)) | [06](06-hero.md) |
| 2 | Work (product demos: Fryto, Goldstein, Waypoint) | outline | [04](04-team-tools-catalog.md) Figma row |
| 3 | Experience | outline | [04](04-team-tools-catalog.md) Linear / git rows |
| 4 | Research & teaching | outline | [04](04-team-tools-catalog.md) Notion row |
| 5 | Now (casual only) | outline | — |
| 6 | Writing (blog mirror) | outline | [02](02-information-architecture.md#blog-mirror) |
| 7 | How working together goes (hire only) | outline | [04](04-team-tools-catalog.md) pipeline row |
| 8 | Contact | outline | [04](04-team-tools-catalog.md) calendar row |
| 9 | Dark mode (`:set bg=dark`) | later | [03](03-design-language.md#colour) |

## Open questions (owner decides)

| # | Question | Default until answered |
|---|----------|------------------------|
| 1 | Which value line, and does it differ per view? | Candidate 1 everywhere ([06](06-hero.md)) |
| 2 | Static caret after the value line: yes or no? | Yes, behind one prop |
| 3 | Accent colour | Near-black inverse (no colour) |
| 4 | Font pairing | Implementer proposes two pairings with screenshots |
| 5 | Presence segment: Slack-style `● around 14:02` or status-page `all systems operational`, or none? | None |
| 6 | Mode labels: `casual` / `hire`, or `casual` / `work with me`? | `casual` / `hire` |
| 7 | Public email address | Hide `:mail` until set |
| 8 | Cal.com link | Hide `:cal` until set |
| 9 | Blog feed URL | Writing section not built |
| 10 | Which demo surfaces per product (Fryto ops, Goldstein, Waypoint) and how they are hosted | Decide at section 2 |

## Decision log

| Date | Decision |
|------|----------|
| 2026-10-29 | Keep the Next.js shell; no Astro rewrite. |
| 2026-10-29 | Two optional views (`/hire`, `/casual`) plus neutral `/`; URL is the source of truth. |
| 2026-10-29 | Editor shell (Vim statusline + command line) is the layout spine; other team tools are one accent per section. |
| 2026-10-29 | Hero is a single value line on flat white; the view choice lives in the statusline. (Superseded: canvas is now charcoal.) |
| 2026-10-29 | Blog is a separate site; portfolio mirrors the latest three posts. |
