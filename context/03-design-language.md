# 03 — Design language

## Idea

**The site is a document open in the tools a team works in.** The content is calm, flat and
minimal. The *frame* around it borrows the working surfaces of the apps that engineers,
designers, PMs, team leads and managers live in every day. A visitor from any of those roles
should recognise something of their own tool, without the site turning into a costume.

The spine is an editor (Vim): a statusline and a command line that do real navigation work.
Other tools appear as one small borrowed element per section, chosen for the role that section
speaks to. The catalog is [04-team-tools-catalog.md](04-team-tools-catalog.md).

## Minimal rules

1. **Flat canvas, no ornament.** No gradients, glows, textures, cards-on-cards or drop shadows on content.
2. **One idea per screen** in the hero; one job per section afterwards.
3. **Remove before adding.** Every element must do a job: navigate, show status, or carry proof.
4. **Whitespace is the layout.** Alignment and spacing make the structure; rules and boxes are a last resort.
5. **Real content only.** No lorem ipsum, fake metrics, placeholder testimonials or stock icons as filler.

## Flavour rules (how much tool, where)

- **Chrome vs content.** Tool flavour lives in the chrome (statusline, command line, labels, IDs,
  metadata). Content text stays plain prose.
- **At most one borrowed element per section**, and it must do a job there
  (a status, an ID, a selection outline that reveals a demo's size). Decoration-only borrowing is cut.
- **Evoke, never copy.** No logos, product names in the UI, brand colours (Figma blue, Linear
  purple, Slack aubergine) or pixel-copied trade dress. Monochrome interpretations only.
- **Mouse first, keyboard rewarded.** Every keyboard feature has a visible click/tap equivalent.
- **No fake terminal theatre.** No typing animations, no blinking cursors, no scrolling fake logs.

## Type

- Two families only: one **proportional** family for content, one **monospace** for chrome
  (statusline, command line, IDs, hashes, dates, keyboard hints). A matching superfamily
  (sans + mono from the same designer) keeps it coherent.
- Monospace never appears in headings or body copy. It is the "tool" voice, used sparingly.
- Hero value line: large and set tight; body copy ~16–18px with a 60–70ch measure.
- Final family choice is an open question ([08](08-roadmap.md)). Propose two pairings with
  rationale; do not default to Inter.

## Colour

- **One ground, one ink, two signal fills.** Warm charcoal canvas (`#1f1e1d`), cream ink
  (`#f0eee6`), clay accent (`#d97757`), sage state block (`#a9c39b`). Dark ink sits on both fills.
- Palette is Claude Code's: the terminal's charcoal, clay and sage, not a brand's colours.
- **Accent use stays narrow:** the active mode block, the static caret, focus rings and selection.
  Sage marks the current state (the mode block), clay marks the position; nothing else is filled.
- Surfaces step in tone, never in lines or shadows: canvas `#1f1e1d`, bar/cards `#262624`,
  raised `#2b2a27`, hairline `#3a3835`.
- Colours come from `@manovaspace/tokens` semantic variables (`src/theme/claude-code.ts` for the
  authored scheme, `src/theme/claude-code.css` for the dark surface stack). No hard-coded hex in
  components.
- Dark is the v1 canvas and is forced. Light mode (`:set bg=light`) is a later feature, not a v1
  requirement; the light scheme is already authored in the token file.

## Motion

- Purposeful only: view switch (reorder via View Transitions where supported), command line open/close,
  section focus in the statusline. 120–200ms, ease-out. Nothing loops.
- `prefers-reduced-motion: reduce` → no movement, instant state changes.

## Design skills

Use the workspace skill `design-taste-frontend` to inspect and critique pages
(`scripts/inspect.mjs` against `http://localhost:12000`). This brief wins over its house style and
its dealt directions: warm charcoal canvas, mono chrome, the clay/sage fills and the shell are fixed here.
For later product-demo sections, `impeccable critique` / `polish` are the better fit.
Do not load both skills in one task.
