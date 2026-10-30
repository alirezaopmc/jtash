# 06 — Hero

## Spec

- **Flat white, one line.** The hero is the value line and nothing else in the canvas: no name,
  no photo, no subtitle, no buttons, no scroll arrow, no background effect.
- The name lives in the document `<title>` and the statusline buffer (`~/jtash/...`).
- The casual/hire choice lives in the statusline mode segment, not in the hero ([05](05-layout-shell.md)).
- The scroll cue is the statusline's `Top` indicator.
- Height: `100svh` minus the statusline. Line sits left-aligned on the content grid, slightly above
  vertical centre (~40% from the top), max 16–18ch per line before wrapping.
- Type: the proportional family, large (`clamp(2.5rem, 6vw, 5.5rem)` as a starting point), tight
  leading (1.05–1.1), balanced wrapping (`text-wrap: balance`).
- Optional **static caret**: a solid block `▍` in the accent colour directly after the last word,
  like a Vim cursor. Never blinks. `aria-hidden="true"`. Owner decides (open question); build it
  behind a single prop so it can be removed in one line.
- The value line is the page `<h1>`.
- Per-view line: `profile.valueLine[view]`. The three may be identical; neutral is the default.
- Motion: none required. If any, a single 200ms opacity fade on first paint, disabled under reduced motion.

## Value line candidates

Owner picks one per view (or one for all). Each avoids naming a job type.

| # | Line | Leans |
|---|------|-------|
| 1 | I turn rough ideas into products people pay for. | Hire, neutral |
| 2 | I build the whole thing — the code and everything around it. | Neutral |
| 3 | Engineer by trade. I also do the parts nobody owns. | Hire |
| 4 | From first commit to first invoice. | Hire, terse |
| 5 | I build products, study how language models think, and teach. | Casual |
| 6 | Software, products, and the people in between. | Casual, neutral |

Until the owner chooses, implement with candidate 1 for all views, sourced from `src/content/profile.ts`.

## Acceptance

- [ ] At 320, 375, 768, 1440 and 1920px wide: one line block, no horizontal scroll, nothing else
      in the canvas, statusline visible and not overlapping the line.
- [ ] Line is an `<h1>`; contrast ≥ 7:1 against the background.
- [ ] `/`, `/hire`, `/casual` render the line for their view; switching via the statusline keeps
      the hero in place (no layout jump).
- [ ] No client JavaScript is needed to render the hero (Server Component).
- [ ] Reduced motion: no movement at all.
- [ ] Copy comes from `src/content/profile.ts`, not the component.
- [ ] `design-taste-frontend` `inspect.mjs` run against the hero shows no FAIL findings, or each
      remaining one is listed with the reason it is intentional.
