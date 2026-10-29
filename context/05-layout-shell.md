# 05 — Layout and shell

The page is a single scrolling canvas with a fixed **statusline** at the bottom. The statusline
turns into a **command line** when invoked. There is no top navigation bar.

## Desktop

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                                                                              │
│                                                                              │
│      I turn rough ideas into products people pay for.▍                       │  ← hero (06)
│                                                                              │
│                                                                              │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ casual │ HIRE │ ~/jtash/hero                      ● around 14:02   : cmd   Top│  ← statusline
└──────────────────────────────────────────────────────────────────────────────┘
```

Command line open (`:` or `⌘K` or click `: cmd`):

```
│   :hire        professional view                                            │
│   :casual      get to know me                                               │
│   :mail        write an email                                               │
│   :cal         book 30 minutes                                              │
│   :tg          message on Telegram                                          │
│   :help        keys and commands                                            │
├──────────────────────────────────────────────────────────────────────────────┤
│ :ca▍                                                                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Mobile (≤ 640px)

```
┌───────────────────────────────┐
│                               │
│  I turn rough ideas into      │
│  products people pay for.▍    │
│                               │
├───────────────────────────────┤
│ NORMAL │ casual │ HIRE │ Top │  ← 28px, safe-area inset
└───────────────────────────────┘
```

Metadata and clock are hidden on mobile; the buffer path and the position block stay. The `:`
button opens the command line as a bottom sheet (full width), suggestions above the input,
keyboard-friendly on touch.

## Statusline segments

| Segment | Content | Behaviour |
|---|---|---|
| Mode | On `/` a static `NORMAL` block marks the neutral view; otherwise one of `casual` `hire` is the filled sage block with dark ink, like Vim's mode block. | `next/link` to `/casual` and `/hire`; active link has `aria-current="page"`. Clicking the active one returns to `/`. This **is** the optional two-way choice, so the hero stays a single line. |
| Buffer path | `~/jtash/<section-id>` for the section in view | Updated by an IntersectionObserver; not a live region (would be noisy). Visible at every width. |
| Metadata | `utf-8 · en` | Static, 60% opacity, hidden below `sm`. |
| Clock | Local time, `01:13 AM` | Updated every 30 seconds; hidden below `sm`. |
| Position | `Top`, `Bot`, or a percentage (Vim), or `2/6` (sections) | Clay block with dark ink, bold. Doubles as the scroll cue on the hero: `Top` means there is more below. |

Height 28px at every width. 11px JetBrains Mono at 1.5 line-height, single row, `px-3` per
segment, no border, no radii. Filled blocks are bold (700) with dark ink on the fill; plain
segments are 400 in the muted tone. The bar sits one tone above the canvas (`card`), so the
edge is a step in tone rather than a hairline. Must never cover content: the canvas gets
matching bottom padding and `scroll-padding-bottom`.

### Appearance

Status-strip grammar, matched to the reference strip:

- Segments are flush: active mode block at the left edge, position block at the right edge,
  everything between is plain text on the bar surface with a flexible spacer before the clock.
- Exactly two fills on the bar: sage `#8fbf7f` for the active view, clay `#d97757` for the
  position. Both use `#0e0d0c` ink.
- The buffer path is the same muted tone as the rest of the bar; only the fills carry weight.
  Metadata sits at 60% opacity.
- No shadows, gradients or rounded corners anywhere in the bar.

## Command line

- Opens with `:`, `⌘K`/`Ctrl+K`, or the `: cmd` button. Closes with `Esc`, outside click, or after running a command.
- Accessible pattern: a dialog containing a combobox input and a listbox of commands.
  Focus moves to the input on open and returns to the trigger on close.
- Typing filters by prefix then fuzzy match; the leading `:` is optional. `Enter` runs the
  highlighted command; `↑`/`↓` and `Tab` move the highlight.
- After running, print one line of output in the statusline for ~3s, terminal style
  (`opening mail…`, `E37: No such command: :foo`). Announce it via a polite live region.
- Build it as a product component in `src/components/shell/` on top of `@manovaspace/ui`
  primitives (`Dialog`/`Sheet`, `Input`). The UI package has no command palette; do not add a
  third-party one (`cmdk` etc.) without asking.

### Commands (v1)

| Command | Aliases | Action |
|---|---|---|
| `:hire` | `:h` `:work` | Navigate to `/hire` |
| `:casual` | `:c` | Navigate to `/casual` |
| `:home` | `:e .` | Navigate to `/` |
| `:mail` | `:m` | `mailto:` (address TBD) |
| `:cal` | `:book` | Open Cal.com link in a new tab (TBD) |
| `:tg` | `:telegram` | Open `https://t.me/alirezaopmc` |
| `:goto <section>` | `:<section-id>` | Scroll to that section |
| `:help` | `?` | Short man-page style panel with keys and commands |
| `:q` | `:wq` `:q!` | Closes the command line and prints `you can't quit this one — :mail me instead`. The only joke. |
| `:set bg=dark` | | Later. Until dark mode exists, prints `E519: Option not supported yet` |

## Keymap

Active only when focus is not in an input/textarea/contenteditable and no modifier key is held
(except the `⌘K` chord). Never prevent default scrolling keys (space, arrows, PageUp/Down).

| Key | Action |
|---|---|
| `:` / `⌘K` / `Ctrl+K` | Open command line |
| `j` / `k` | Next / previous section (smooth scroll unless reduced motion) |
| `g g` | Top · `G` bottom |
| `?` | `:help` |
| `Esc` | Close command line / help |

Every key action has a visible click/tap equivalent (statusline buttons, command list).

## End of page

After the last section, a short column of `~` characters in the muted colour at the left margin,
as in Vim past the end of the buffer. `aria-hidden="true"`. This replaces a footer; legal/footer
text, if ever needed, goes into `:help`.

## Landmarks and accessibility

- `<main>` holds the sections; each section is a `<section aria-labelledby>` with a real heading
  (the hero heading may be visually the value line itself as `<h1>`).
- The statusline is `<nav aria-label="Site">` placed after `<main>` in DOM order; add a skip link
  "Skip to commands" only if testing shows it is needed.
- Visible focus rings in the accent colour. Touch targets ≥ 44px on mobile.
- Shell works without JavaScript: mode links and section anchors are plain links; the command
  line and keymap are progressive enhancement.
