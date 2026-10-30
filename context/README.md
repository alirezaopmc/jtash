# jtash.ir — implementation context

Start here. These files are the brief for an agent implementing the new portfolio.
They hold decisions made with the owner; implement them, do not re-decide them.
Anything still undecided is listed as an open question. Ask before resolving it.

## Reading order

| # | File | What it settles | Read when |
|---|------|-----------------|-----------|
| 1 | [01-brief.md](01-brief.md) | Who the site is for, positioning, voice, contacts | Always |
| 2 | [02-information-architecture.md](02-information-architecture.md) | Routes, the two views, section order, content model | Always |
| 3 | [03-design-language.md](03-design-language.md) | Minimal rules, type, colour, motion, how the tool flavour is applied | Any UI work |
| 4 | [04-team-tools-catalog.md](04-team-tools-catalog.md) | Which team apps lend which element, and to which section | Building a section |
| 5 | [05-layout-shell.md](05-layout-shell.md) | The editor-style shell: statusline, command line, keymap | Layout work |
| 6 | [06-hero.md](06-hero.md) | The first section, spec and acceptance | Hero work |
| 7 | [07-implementation-guide.md](07-implementation-guide.md) | Stack, files, conventions, verification, git | Before writing code |
| 8 | [08-roadmap.md](08-roadmap.md) | Section order, status, open questions | Picking the next task |

Repository rules in [`../AGENTS.md`](../AGENTS.md) still apply and win on conflict.

## How the owner works

- **One section per task.** Build the shell and hero first, show it, get approval, then move on.
  Never build the whole site in one go.
- **Advice over design.** The owner wants options and a recommendation, then decides.
- **Minimalism is the point.** When unsure, remove.

## Current scope

The shell layout ([05](05-layout-shell.md)) and the hero ([06](06-hero.md)).
Every other section in [08](08-roadmap.md) is outline only; do not build it yet.

## Keeping these files true

When a decision changes or an open question is answered, update the file that owns it
and the status in [08-roadmap.md](08-roadmap.md) in the same change. One fact, one file.
