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
│ casual │ HIRE │        :  Top │  ← 44px min height, safe-area inset
└───────────────────────────────┘
```

Buffer path and presence segment are hidden on mobile. The `:` button opens the command line as
a bottom sheet (full width), suggestions above the input, keyboard-friendly on touch.

## Statusline segments

| Segment | Content | Behaviour |
|---|---|---|
| Mode | Two words: `casual` `hire`. On `/` neither is active. On `/hire` the `HIRE` block is inverted (accent background), like Vim's mode block. | `next/link` to `/casual` and `/hire`; active link has `aria-current="page"`. Clicking the active one returns to `/`. This **is** the optional two-way choice, so the hero stays a single line. |
| Buffer path | `~/jtash/<section-id>` for the section in view | Updated by an IntersectionObserver; not a live region (would be noisy). Desktop only. |
| Presence | One of: `● around 14:02` (Slack) or `all systems operational` (status page). Open question | Local time in Europe/Istanbul, updated each minute. Static text, no live region. |
| Command | `: cmd` hint | Button; opens the command line. `aria-keyshortcuts=": Meta+K Control+K"`. |
| Position | `Top`, `Bot`, or a percentage (Vim), or `2/6` (sections) | Doubles as the scroll cue on the hero: `Top` means there is more below. |

Height 32px desktop, 44px mobile. Monospace, small (12–13px), single row, top hairline only.
Must never cover content: the canvas gets matching bottom padding and `scroll-padding-bottom`.

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
