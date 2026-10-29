# Task 01 — Shell skeleton and hero

Slices 1 and 2 of [07-implementation-guide.md](../07-implementation-guide.md#task-slices-do-in-order-one-pr-each).
Read first: [`../../AGENTS.md`](../../AGENTS.md), [05-layout-shell.md](../05-layout-shell.md),
[06-hero.md](../06-hero.md), [03-design-language.md](../03-design-language.md).

## Goal

Three routes (`/`, `/hire`, `/casual`) and a 404, each showing the hero value line on a flat white
canvas with a fixed bottom statusline. No command line, no keymap, no section tracking yet.

## Files you may create or change

```
src/app/layout.tsx
src/app/page.tsx
src/app/hire/page.tsx            (new)
src/app/casual/page.tsx          (new)
src/app/not-found.tsx            (new)
src/app/globals.css              (append only; never reorder the existing imports)
src/components/providers.tsx     (theme props only)
src/components/view-page.tsx     (new)
src/components/sections/hero.tsx (new)
src/components/shell/shell.tsx       (new)
src/components/shell/statusline.tsx  (new)
src/content/types.ts     (new)
src/content/profile.ts   (new)
src/content/sections.ts  (new)
src/content/shell.ts     (new)
```

Nothing else. No new dependencies.

## Requirements

### Content (`src/content/`)

- `types.ts`: `View = "neutral" | "hire" | "casual"`, `Profile`, `Section` as in
  [02-information-architecture.md](../02-information-architecture.md#content-model) (only the fields used now).
- `profile.ts`: `name: "Jay Tash"`; `valueLine` = `"I turn rough ideas into products people pay for."`
  for all three views; `contacts.telegram = "https://t.me/alirezaopmc"`; no email or cal yet.
- `sections.ts`: one section, `{ id: "hero", label: "hero", order: { neutral: 1, hire: 1, casual: 1 } }`.
- `shell.ts`: statusline copy: mode labels `casual` / `hire`, buffer prefix `~/jtash/`,
  position label `Top`, nav label `Site`, 404 copy (`E37: No such page`, link text `:home`).
- No user-visible string may be hard-coded in a component.

### Theme

In `providers.tsx`, force light: `forcedTheme="light"` and `enableSystem={false}` on `ThemeProvider`
(keep the provider order and the single `Toaster`).

### Pages

- `view-page.tsx` (Server Component): `ViewPage({ view })` renders `<main>` with the sections whose
  `order[view]` is set, sorted by it. Only `hero` exists.
- `page.tsx`, `hire/page.tsx`, `casual/page.tsx` each render `<ViewPage view=... />` and export
  `metadata` (title: `Jay Tash`, `Jay Tash · hire`, `Jay Tash · casual`; description: the view's value line).
- `not-found.tsx`: the 404 copy as an `<h1>` in the same canvas style, plus a `next/link` to `/`.

### Hero (`sections/hero.tsx`, Server Component)

- `<section id="hero" aria-labelledby="hero-title">` containing only `<h1 id="hero-title">` with the value line.
- Height `calc(100svh - var(--statusline-h))`. Line left-aligned on the page gutter, its top at
  roughly 35–40% of the viewport height.
- Size `clamp(2.5rem, 6vw, 5.5rem)`, line-height 1.05–1.1, `text-wrap: balance`, `max-width: 16ch`,
  weight 500–600, colour `text-foreground`.
- Prop `caret?: boolean` (default `true`): renders a solid block `▍` right after the last word,
  `aria-hidden="true"`, colour `text-foreground`, **no animation**.
- No other element in the hero.

### Shell (`shell/shell.tsx`, `shell/statusline.tsx`)

- `layout.tsx` wraps `{children}` in `<Shell>`; `Shell` renders children then `<Statusline />`.
- CSS variable `--statusline-h`: `28px` at every width. `body` (or the shell wrapper) gets
  `padding-bottom: var(--statusline-h)` and `html` gets `scroll-padding-bottom: var(--statusline-h)`
  so nothing hides under the bar.
- Statusline: `<footer>` containing `<nav aria-label="Site">`, fixed to the bottom, full width,
  height `var(--statusline-h)`, `bg-card`, no border, monospace (`font-mono`), 11px/1.5, one row,
  `px-3` per segment, `padding-bottom: env(safe-area-inset-bottom)` added to the height on iOS.
- Segments left → right:
  1. **Mode:** two `next/link`s, `casual` → `/casual`, `hire` → `/hire`. It is a client component
     using `usePathname()`. The active one is a filled sage block
     (`bg-status-success text-status-success-foreground font-bold`, uppercase like Vim's mode block)
     with `aria-current="page"`, and its `href` becomes `/` (clicking the active mode clears the
     choice). Neither is active on `/`.
  2. **Buffer path:** `~/jtash/hero`, muted foreground, visible at every width.
  3. **Metadata:** `utf-8 · en`, 60% opacity, hidden below 640px.
  4. Flexible spacer.
  5. **Clock:** local time, hidden below 640px.
  6. **Position:** `Top`, filled clay block (`bg-primary text-primary-foreground font-bold`, uppercase).
- Visible focus ring (`ring`) on every link. No hover effects beyond a colour change.
- The 28px bar is below the 44px touch-target guideline on purpose: it matches the reference strip;
  links keep a wide horizontal target.

### Type

Add to `globals.css` (after the existing blocks) two variables used by Tailwind `font-sans` /
`font-mono`: system stacks for now (`ui-sans-serif, system-ui, …` and `ui-monospace, SFMono-Regular, …`).
The final font pairing is an open question; do not add `next/font` yet.

## Out of scope

Command line, `: cmd` segment, keymap, section tracking, presence segment, end-of-page tildes,
dark mode, other sections, animations, view transitions.

## Verification (must all exit 0)

```bash
bun run typecheck
bun run lint
bun run build
```

Then start `bun run dev` only if needed to sanity-check, and stop it before finishing.
Report: files changed, the three command results, anything you were unsure about.
