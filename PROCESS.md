# Process overview

A reading-guide to how the work came together — a map to your process, not an
essay about it. Markers read this file and follow its citations; they don't
trawl the repo for evidence you didn't point at, so if a moment mattered, cite
it.

This file is the shape; the course site's
[assessment page](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/assessment/#what-you-submit)
is the requirement, and its
[word counts](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/assessment/#word-counts)
cover every deliverable.

## What I built

**Reaction Rush** — a full-screen reflex game. The screen alternates between GREEN (click the central button) and RED (don't click); during GREEN, clicking scores one point and immediately changes the screen to RED; during RED, clicking immediately ends the round; and ten consecutive successful GREEN clicks wins the game. As the score increases, the interval between colour changes becomes shorter, so the game starts slowly enough for a first-time player to understand and becomes genuinely difficult toward the end. There are no how-to-play instructions anywhere in the game — the opening GREEN screen and the single button are the only interaction cues available to the player.

## The moments that mattered

### 1. A GREEN click could originally score more than one point

My initial state model kept the game in the GREEN state after a successful click, meaning that a player could potentially score twice by clicking twice within the same time window.

Before writing any code, I checked the state model and directed a change: a GREEN click must score one point and immediately switch to RED. This ensures that each time window can only be worth one point, regardless of how many times the player attempts to click.

This rule is encoded in `click()` and is also verified by the focused test below.

[`4850680`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-jojo111111111025/commit/4850680)

### 2. Choosing one rule to test

The spec gives the example:

> "a test can establish that a collision ends the round"

The direct equivalent in this game is:

> "Clicking during RED always causes a loss, regardless of the current score."

This test does not require the DOM or a build step because `click`, `flip`, and `intervalFor` in `game.ts` are pure functions with no timer or rendering logic. Therefore, `spec/crit-5.test.ts` can import and test them directly.

The GREEN-click scoring rule also has a second test because it is another core rule in the same function and is equally straightforward to verify: a successful click increases the score and moves the game to RED, while the tenth successful click immediately produces a WIN.

[`4850680`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-jojo111111111025/commit/4850680)

### 3. The interaction model changed twice based on design direction, before playtesting

The first working version treated the entire screen as the clickable area and used a row of progress dots to show progress.

First, I directed the design so that the background would remain full-screen colour, but **the only interactive element would be one large central button**, rather than the whole screen.

Then, I requested a small game title, subtitle, score, and state indicator above the button. These elements were intentionally kept visually secondary to the colour and button so that the game remained simple and immediately understandable without a tutorial.

These two changes were explicit design decisions made before the actual playtesting of the finished build, rather than changes based on observing someone play.

The current full-screen background, central button, and HUD are the result of these changes.

[`6eb86cb`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-jojo111111111025/commit/6eb86cb)

4. **Native `<button>` instead of a hand-rolled clickable surface.** The
   first build's restart control was a button nested inside the clickable
   surface `div`, so its clicks bubbled up and could double-fire as a game
   move — I caught this while implementing it and patched around it with
   target checks and `stopPropagation()`. Moving to a single native
   `<button>` as the only control (the same button doubles as restart once a
   round ends) removed the whole bug class instead of patching it further:
   `<button>` gets Enter/Space and focus handling for free, and there's only
   one click target left to reason about
   ([`6eb86cb`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-jojo111111111025/commit/6eb86cb)).

5. **Restart affordance after a cold playtest.** I played the finished build
   cold, the way the spec asks — no reading the code first. After losing a
   round, I wasn't immediately sure the central button was the thing to click
   to go again: the button carries no label in any state, and the only
   on-screen cue for LOST is the small HUD text ("TOO EARLY"), which doesn't
   say what to do next. The button already restarts the round in both WON and
   LOST (`act()` in `main.ts`), so this was a labelling gap, not a logic one.
   The fix: `render()` now sets the button's visible text to "RESTART" and its
   `aria-label` to "Restart" only while `phase === "lost"`; every other phase
   keeps the button unlabelled, exactly as before. WON is left alone — the
   confusion I actually hit was specific to LOST, and the core GREEN/RED
   mechanic in `game.ts` is untouched
   ([`1c96295`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-jojo111111111025/commit/1c96295)).

## What still needs a human

- **No headless browser is available in this sandbox** to click-test the
  interaction directly — Playwright's Chromium is present but its system
  shared libraries aren't installed and there's no `sudo` here. The cold
  playtest above (moment 5) was done in a real browser by a person, which is
  what the spec's own playtesting step asks for; what's missing here is only
  automated click-testing as a supplement to `pnpm check`, not the human
  playtest itself.

---

# Before submission

`pnpm check:evidence` verifies:

* that citations resolve to real commits;
* that a reflection exists in `reflections/` for the marker to read;
* that `CLAUDE.md` is present.

It checks whether the evidence map is traceable, rather than whether the evidence itself is sufficient. The marker will still judge whether the selected moments demonstrate genuine judgement, design thinking, and reflection.

Images are not automatically checked. Unlike an invalid commit SHA, a broken image link will simply become visible when the file is rendered on GitHub.
