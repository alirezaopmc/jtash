# 04 — Team tools catalog

The apps different roles in a team use most, the one element worth borrowing from each, and
where it goes. Rules for applying them are in [03-design-language.md](03-design-language.md#flavour-rules-how-much-tool-where).

**Weight:** `spine` = structural, on every page · `accent` = one section · `maybe` = only if that
section needs it · `avoid` = considered and rejected.

## Catalog

| App | Who lives in it | Signature element | How we borrow it | Where | Weight |
|---|---|---|---|---|---|
| **Vim / Neovim** | Engineers | Statusline with mode block; `:` command line; `~` after end of buffer; `j`/`k`; `Top`/`Bot`/`42%` position | The site shell: bottom statusline, `:` command line, section keys, end-of-page tildes | Shell (all pages) | spine |
| **Terminal (zsh)** | Engineers, DevOps | `~/path` prompt, plain command output, `man` pages | Command results print as one output line; `:help` reads like a short man page | Command line, `:help` | spine |
| **Raycast / Spotlight / ⌘K** | Power users of every role | One palette for everything | `⌘K` opens the same command line, so non-Vim users find it | Shell | spine |
| **Figma** | Designers, PMs reviewing | Frame label above a frame; selection box with corner handles and a `W × H` badge | Each product demo is a "frame": small label `fryto / ops` above it; on hover/focus a 1px accent selection outline with handles and its real size | Work (demos) | accent |
| **Linear** | PMs, team leads, engineers | Issue ID (`JT-12`), status circle (backlog / in progress / done), keyboard hints | Experience as issue rows: ID, title, status circle (done = past, in progress = now), period on the right | Experience — Hire view | accent |
| **Git / GitHub** | Engineers, tech leads | `git log --oneline`: short hash, message; contribution heatmap | Same experience data as a commit log: `a1b2c3d  joined Ravindex as engineer` | Experience — Casual view | accent |
| **Notion** | Managers, everyone | Toggle `▸` blocks for progressive disclosure; page breadcrumb | Research & teaching items as toggles: one line closed, a short paragraph open | Research & teaching | accent |
| **Google Calendar / Cal.com** | Managers, team leads, sales | Time block on a week grid; free/busy | The booking link renders as a single calendar block ("30 min · pick a time"), not a big button | Contact | accent |
| **Slack** | Managers, everyone | Presence dot and status text | One statusline segment: `● around` / `○ away` with local time (Istanbul). A clue that a message will be read | Shell statusline | maybe |
| **Status pages / Datadog** | SREs, engineering managers | "All systems operational" with uptime bars | Alternative to the Slack segment: `all systems operational` as the availability clue. Pick one of the two, not both | Shell statusline | maybe |
| **HubSpot / Salesforce** | Sales, founders | Pipeline stages | "How working together goes" as 3–4 quiet stages (`talk → scope → build → hand over`), no CRM chrome | How working together goes — Hire | maybe |
| **Keynote / Slides** | Managers, sales | Slide counter `3 / 7` | Folded into the statusline position segment (`3/6` sections) | Shell statusline | maybe |
| **VS Code** | Engineers | Breadcrumbs, tabs, minimap | Breadcrumbs folded into the statusline buffer path; no tabs, no minimap | Shell statusline | maybe |
| **Google Sheets / Excel** | Managers, finance, sales | Cell refs, `fx` formula bar | Rejected for v1: a formula bar reads as a joke, tables add weight | — | avoid |
| **Jira** | PMs | Boards, tickets | Linear covers the PM sense with less bureaucracy | — | avoid |
| **Miro / FigJam** | Facilitators, PMs | Sticky notes | Fights the flat white canvas | — | avoid |
| **Trello / Kanban** | PMs | Columns of cards | Cards-in-columns is the template look we are avoiding | — | avoid |
| **Loom** | Managers | Video bubble | Adds media weight; revisit only with a real intro video | — | avoid |
| **Analytics (GA, Amplitude)** | Marketing, growth | Funnels, sparklines | Only next to a real metric on a work item; never decorative | Work items | maybe |

## Placement map

```
Shell (every page)   Vim statusline + command line (+ ⌘K) · one presence/status segment (pick one)
Hero                 nothing borrowed except the optional static caret
Work (demos)         Figma frame labels + selection outline
Experience           Hire: Linear issue rows · Casual: git log
Research & teaching  Notion toggles
Writing              terminal listing: `ls -t` style date + title, links out
How we work (Hire)   pipeline stages (quiet)
Contact              calendar block · mail · telegram · mirrored by :mail :cal :tg
End of page          Vim `~` tildes
```

The role mix this gives: engineers (Vim, terminal, git), designers (Figma), PMs and team leads
(Linear, Notion), managers and sales (calendar, presence, pipeline). That spread is the point:
it shows a generalist without saying "generalist".
