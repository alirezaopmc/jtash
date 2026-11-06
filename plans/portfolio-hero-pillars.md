# Portfolio: Claude Code hero + three-pillar scroll story

## Goal

Build the first two parts of a modern, minimal-but-playful portfolio for a senior software engineer and product manager:

1. **Hero**: a Claude Code CLI scene (tmux-style, close to the real screenshot) with the slogan **"AI knows as much as you."** and a prompt-rewrite animation showing prompting skill and edge-case thinking.
2. **Three pillars**: a pinned scroll section where the title **"I bring ___ to \_\_\_"** docks to the top and changes as you scroll, in this order: **trust → systems** (backend), **clarity → products** (product), **feeling → applications** (frontend). Each pillar has its own non-technical animation.
3. **Temporary dev tools panel** for switching between design alternatives live.

Out of scope: projects, about, contact, recruiter view, CMS/backend.

## Concept: every visual has a reason

- **One story runs through everything: a delivery cancellation.**
  - Hero: writing the _prompt_ for the cancel API.
  - Trust: the cancel still works when things break.
  - Clarity: finding _why_ customers cancel.
  - Feeling: the cancel screen feels good to use.
    The visitor sees one person handle one problem from every angle.
- **Colors come from the terminal's own palette**, so the hero "hands out" the pillar colors:
  - Claude salmon/orange `#D77757`: the AI / the slogan (from the mascot).
  - **Trust = green** `#5FA36A`: tmux status bar, "system healthy".
  - **Clarity = yellow** `#E5C04B`: the "auto mode on" line, attention/highlight.
  - **Feeling = rose/salmon** `#E79A8C`: the warm mascot, something alive.
  - Base: terminal black `#141414`, panels `#1B1B1B`, text `#E6E6E6`, muted `#8A8A8A`, rules `#2A2A2A`.
- **Background**: a very faint grid of terminal character cells. Near the active pillar it warms slightly toward that pillar's color: "the page is the terminal". No decorative blobs.
- **Motion is scroll-driven**, so the visitor controls the story. Ambient idle motion stays subtle. `prefers-reduced-motion` (or the dev tools toggle) shows each scene's final state with no animation.

## Tech decisions

- Add dependency **`motion`** (`motion/react`: `useScroll`, `useTransform`, `useSpring`, `AnimatePresence`). Scenes are **SVG + React** that use a `viewBox` so they scale. No canvas, no other libraries.
- Fonts in `src/index.css` through a Google Fonts CSS2 `@import` placed first: **JetBrains Mono** (terminal and title) and **Instrument Serif italic** (an optional accent for the key word, toggled in dev tools). Define `--font-mono` / `--font-serif` and the color tokens in `@theme`. Element defaults go in `@layer base`.
- All copy lives in one file, `src/content.ts` (identity placeholders, words, subjects, prompt scenarios, scene labels), so you can edit it without touching components.
- Dark only.

## File structure

```
src/
  App.tsx                      # DevToolsProvider > Background, Hero, Pillars, DevToolsPanel
  index.css                    # fonts, @theme tokens, base layer, cell-grid bg, caret blink keyframes
  content.ts                   # all copy + scenario data
  lib/
    useSequence.ts             # timeline runner for typed/scripted steps (speed-aware, skippable)
    useMotionPrefs.ts          # combines prefers-reduced-motion + devtools override + speed multiplier
  devtools/
    options.ts                 # typed option catalog + defaults
    DevToolsContext.tsx        # context, localStorage persistence ("portfolio-devtools-v1")
    DevToolsPanel.tsx          # floating panel UI
  hero/
    Hero.tsx                   # chooses layout variant
    Terminal.tsx               # window chrome, tab bar, header block, transcript, input box, status bar
    Mascot.tsx                 # pixel creature (SVG rects), variants: classic / blink / initials
    PromptRewrite.tsx          # the scripted prompt-rewrite story
    RotatingLine.tsx           # "I bring <word> to <subject>" cycling under the slogan
  pillars/
    Pillars.tsx                # tall scroll container + sticky stage, maps progress → active pillar
    DockedTitle.tsx            # sticky top title + 3-step progress indicator
    MorphWord.tsx              # word transition styles: roll / decode / blur
    scenes/
      TrustCalmSurface.tsx     # Trust A (default)
      TrustSelfHealing.tsx     # Trust B
      ClaritySignal.tsx        # Clarity A (default)
      ClarityUntangle.tsx      # Clarity B
      FeelingComesAlive.tsx    # Feeling A (default)
      FeelingTwoButtons.tsx    # Feeling B
```

## Hero

### Terminal chrome (matches screenshot 1)

- Full-viewport window with rounded border:
  - **Tab bar**: traffic lights, sidebar/search/arrow icons drawn as small inline SVGs, tabs `Chat`, `tmux`, active `tmux`, `+`.
  - Sub-bar reading `tmux`.
- **Header block**: pixel mascot + `Claude Code v2.1.316` (bold name, muted version), `Senior Engineer · Product Manager`, `~/dev/<your-name>`. These are placeholders from `content.ts`.
- **Body**:
  - The slogan, large (clamp ~40–96px, mono, `AI knows as much as you.` with "you." in Claude salmon).
  - The **RotatingLine** under it.
  - The transcript area where the prompt story plays.
- **Bottom, exactly like the real CLI**:
  - Right-aligned meta line: `◐ high · /effort · ✔ context loaded` (green check).
  - Input box between two rules with a `❯` prompt and a block caret.
  - `▸▸ auto mode on (shift+tab to cycle)` in yellow.
  - Green tmux status bar: `[1] 0:claude*` on the left, `"✻ Portfolio" HH:MM DD-Mon-YY` on the right, a live clock.
- Below the status bar, a muted `scroll ↓` hint that fades after the first scroll.

### Prompt-rewrite story (default scenario: delivery cancel)

Plays once after load (~14s at 1×). A small `↻ replay` sits in the meta line. Clicking or pressing a key skips to the end.

1. The input types the weak prompt: `Create a new API for canceling the delivery`.
2. The caret pauses. A dim Claude-style hint appears: `✻ Claude will have to guess: refunds? couriers? double taps?`. This shows the AI can only guess.
3. The weak prompt gets a **strikethrough**, drops to 40% opacity and moves up into the transcript as a discarded draft.
4. The strong prompt types into the input (multi-line, with the rule lines growing to fit):

```
/new-feature cancel-delivery
Add POST /deliveries/{id}/cancel for customers and support agents.
  · Allowed until pickup. After that → 409 with a human-readable reason.
  · Idempotent: a double-tap must never refund twice.
  · Courier accepts at the same second? Lock the order; last write must not win.
  · Refund fails → keep the cancel, queue a retry, alert support.
Done when every rule has a test. Ask before touching the schema.
```

Key terms (`409`, `Idempotent`, `Lock`, `retry`) briefly highlight in salmon as they appear. 5. "Enter": the prompt goes to the transcript and Claude replies with 3 short streamed lines:

- `● Mapped 4 rules → 9 edge cases`
- `● Wrote tests first`
- `✔ 9 passing · no schema changes`

6. The slogan's "you." gets a short salmon underline sweep. That is the payoff: the result was only good because of what _you_ knew.

Alternative scenarios in dev tools, same structure (weak → struck → strong → reply):

- **Payment retry**: "Retry failed payments". The strong prompt covers exponential backoff, never charging twice, card-expired vs network error, and notifying after the 3rd failure.
- **Rename a live field**: "Rename user.name to fullName". The strong prompt covers zero downtime, dual-write then backfill then switch reads, a rollback plan, and mobile clients that are 2 versions behind.

Scenario data shape in `content.ts`: `{ id, label, weak: string, hint: string, strong: string[], highlights: string[], reply: string[] }`.

### Hero layout variants (dev tools)

- **A: Full terminal (default)**: everything above sits inside a full-screen terminal.
- **B: Split**: the slogan and rotating line are large on the left, outside a windowed terminal on the right. The terminal only runs the prompt story.
- **C: Slogan as the answer**: the terminal opens empty and the prompt story plays first. Claude's final reply line _becomes_ the big slogan, which scales up.

### RotatingLine

`I bring <word> to <subject>`. The word and subject cycle every 2.6s through trust/systems → clarity/products → feeling/applications. Each word takes its pillar color. It uses the selected MorphWord style. When the visitor scrolls past the hero, this line is visually handed off to the DockedTitle (it fades out as the docked title fades in at the same baseline position, then the docked title moves to the top).

## Three pillars (pinned scroll section)

- `Pillars.tsx`: the outer section is **~420vh** tall with a `sticky top-0 h-screen` stage. `useScroll({ target, offset: ['start start','end end'] })` gives `p ∈ [0,1]`. Each pillar gets about a third, with ~6% crossfade zones between them. Each scene receives its **local progress** `t ∈ [0,1]` as a `MotionValue<number>` plus `active: boolean`.
- **DockedTitle**:
  - Pinned at the top of the stage, large (clamp ~32–64px), reading `I bring <word> to <subject>`. "I bring" and "to" stay fixed. Only the word and subject change, using MorphWord (default **decode**: characters scramble through mono glyphs and settle, like terminal output).
  - The word's color follows the pillar.
  - On the left, three cells `■ □ □` in green/yellow/rose act as the progress bar.
  - Below the title, a single muted mono sentence explains the meaning (from `content.ts`), for example: _"Trust is when nobody notices the storm."_
- Scenes take the area below the title, centered, max-width ~1100px.

### Trust → systems (green)

- **A: Calm surface, stormy depths (default).**
  - Above: a calm customer card, "Order #4821 · Cancelled · Refund on its way", with a steady green dot.
  - Below a thin divider: the "depths", a small diagram of service nodes (Orders, Payments, Couriers, Notify) drawn as rounded mono labels joined by lines carrying moving dots.
  - As `t` advances, problems hit the depths one at a time: a traffic spike (a flood of dots, which a queue shape absorbs and releases evenly), Payments times out (the node flashes red and a retry loop arc returns to green), a duplicate request (two dots merge into one, which is idempotency without the word).
  - The surface card **never changes**, and its dot stays steady green the whole time.
  - Caption beats appear in mono: `spike absorbed` · `retry succeeded` · `duplicate ignored`.
  - Meaning: trust is the user never seeing the storm.
- **B: Self-healing network.** A field of ~24 nodes passes a steady pulse. One node fails (red). Traffic visibly reroutes around it, the node recovers, and the pulse never stops.

### Clarity → products (yellow)

- **A: Signal from noise (default).**
  - ~22 scattered "sticky" request chips drift slowly and overlap: `"add chat"`, `"dark mode"`, `"where is my courier?"`, `"cancel is confusing"`, `"AI?"`, `"faster refunds"`, `"export CSV"`, `"courier is late"`, and so on.
  - As `t` advances, chips group into 3 themes, irrelevant ones dim and slide out, and the remaining ones move together.
  - Finally they collapse into one yellow-highlighted problem statement: **"People cancel because they can't see where their courier is."**
  - Under it, one small line appears: `→ ship: live courier tracking`. Every other feature request is set aside.
  - Meaning: clarity is choosing the one problem that matters.
- **B: Untangle.** Five colored stakeholder lines (Sales, Support, Eng, Design, Users) start as a knot. As you scroll they straighten into parallel lines that end at one target labeled with the same problem statement.

### Feeling → applications (rose)

- **A: Comes alive (default).**
  - The same cancel screen as the Trust surface card starts as a grey wireframe (boxes and lines).
  - Layers switch on in steps as `t` advances, each with a tiny label: `type` (real text), `space` (padding breathes), `color` (rose accent), `motion` (the button gets a spring), `care` (copy changes from "Cancel order" to "Changed your mind? No problem.", and the refund line reads "Back on your card in 2–3 days").
  - At the end the card is **interactive**: it tilts slightly toward the cursor (spring), the button gives press feedback, and a click shows a soft confirmation with a check.
  - Meaning: feeling is the sum of small decisions.
- **B: Two buttons.**
  - Side by side: a "dead" button (instant, no feedback) and a "living" button (hover lift, press squash, a progress fill, a success morph).
  - Visitors can click both. A tiny mono caption under each reads `works` / `feels`.

### Mobile (<768px)

- The terminal hides the tab bar icons and keeps the header block, slogan, input and status bar. The prompt font drops to 12–13px and the strong prompt wraps.
- The pillars stay pinned. Scenes use their SVG `viewBox` to fit, Trust A stacks surface over depths, and Clarity A uses ~12 chips. Feeling A tilt is disabled (no cursor), but tap feedback stays.

## Dev tools (temporary)

- Shown when `import.meta.env.DEV` is true **or** the URL has `?dev`. Toggle with the `` ` `` key or a small `devtools` pill in the bottom-right corner. State lives in context and persists to localStorage. Removing it later means deleting `src/devtools/` and inlining the defaults.
- Controls:
  - Hero layout: A / B / C
  - Prompt scenario: delivery cancel / payment retry / rename live field. A `replay hero` button.
  - Mascot: classic / blinking / initials
  - Word set: **trust/clarity/feeling (default)**, calm/focus/feeling, resilience/purpose/soul, calm/attention/feeling
  - Subject set: **systems/products/applications (default)**, systems/products/interfaces
  - Key-word font: mono (default) / serif italic
  - Word transition: decode (default) / roll / blur
  - Trust scene: A / B · Clarity scene: A / B · Feeling scene: A / B
  - Background grid: on (default) / off
  - Motion speed: 0.5× / 1× / 2× · Force reduced motion: off/on
  - Jump to: hero / trust / clarity / feeling (scrolls to the pillar's progress anchor)
  - **Copy config**: copies the current choices as JSON, so you can paste your picks back to me.
- The panel's own style is a compact mono card in terminal colors, so it looks like part of the site.

## Edge cases and failure handling

- **Reduced motion**: the hero shows the final transcript (struck weak prompt + strong prompt + reply). Pillars cross-fade without scrubbing and each scene shows its final state. The rotating line shows a static "trust".
- **Tab hidden mid-sequence**: the sequence pauses on `visibilitychange` and resumes.
- **Speed changes or replay mid-run**: `useSequence` cancels its timers cleanly (an AbortController-style token).
- **Fonts load late**: use `font-display: swap`. The terminal sizes in `ch`/`rem`, so layout shift is small.
- **Short viewports (<640px tall)**: the slogan size clamps down and the transcript scrolls inside the terminal body without overflowing the page.
- **Fast scrolling**: scenes derive state purely from `t`, so jumping works with no stuck states.

## Verification

- Run the repo's `build` script (`vite build`) and fix any TypeScript or build errors. Run the `format` script (oxfmt).
- Manual check in the running preview (no new dev server):
  - The hero sequence runs fully, skip and replay work, and the clock ticks.
  - On scroll, the title docks. Word and subject change at each pillar boundary in both directions, and the progress cells and colors update.
  - Every scene scrubs forward and backward correctly. Feeling A is interactive at the end.
  - Every dev tools option changes the page. Settings survive a reload, and Copy config produces valid JSON.
  - Widths 375, 768 and 1440. Reduced-motion toggle. `?dev` works.

## Defaults summary

Slogan "AI knows as much as you." · Words trust / clarity / feeling · Subjects systems / products / applications · Hero layout A · Scenario delivery cancel · Scenes Trust A, Clarity A, Feeling A · Decode transition · Mono key word · Placeholder identity in `content.ts`.
