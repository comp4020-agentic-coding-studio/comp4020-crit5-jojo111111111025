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

**Reaction Rush** — a full-screen reflex game. The screen alternates between
GREEN (click the central button) and RED (don't); a GREEN click scores a point
and immediately turns the screen RED, a RED click ends the round on the spot,
and ten GREEN clicks in a row wins. The interval between flips shortens as the
score rises, so a round starts slow enough to read cold and gets genuinely hard
by the end. There is no how-to-play text anywhere — the opening GREEN screen
and the single button are the only affordance a player gets.

## The moments that mattered

1. **A GREEN click was going to be worth more than one point.** My first state
   model kept the phase GREEN after a scoring click, so a player who clicked
   twice inside one window would score twice. Before any code was written I
   walked through the state model with the student, who caught this and
   directed the fix: a GREEN click must score and flip to RED in the same
   step, so a window is worth exactly one point regardless of how many times
   it's clicked. That's the rule encoded in `click()` and the rule the
   focused test below asserts
   ([`4850680`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-jojo111111111025/commit/4850680)).

2. **Choosing the one rule to put under test.** The spec's own worked example
   is "a test can establish that a collision ends the round"; the direct
   analogue here is "a RED click always loses, regardless of score." That
   test needed no DOM or build step to run because `click`/`flip`/
   `intervalFor` in `game.ts` are pure functions with no timers or rendering
   in them — `spec/crit-5.test.ts` imports them directly. The GREEN-click
   scoring rule (score, then flip; the 10th click wins outright) got a second
   test alongside it since it's the other half of the same function and just
   as cheap to assert
   ([`4850680`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-jojo111111111025/commit/4850680)).

3. **The interaction model changed twice on direction, not on play.** The
   first working build made the whole screen the click target with a row of
   progress dots. The student then asked for two specific revisions in turn:
   first, that the background stay a full-screen colour but the *only*
   interactive element be one large central button (not the whole surface);
   then, that a small title/subtitle/score/state readout sit above the
   button, visually secondary to the colour and the button. Both were
   explicit design direction given before anyone had played a working build,
   not changes that came from watching someone play — I'm naming that
   distinction here on purpose, since the spec asks for a *separate* change
   that does come from play (see below, still outstanding). The current
   surface + button + HUD is what's in the repo now
   ([`6eb86cb`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-jojo111111111025/commit/6eb86cb)).

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

## What still needs a human — outstanding before this ships

Two things are not done, and I'm not claiming otherwise:

- **No one has actually played a finished build yet.** `pnpm check` is green
  (typecheck, build, and all game/invariant tests), and the student has
  opened the running dev server themselves, but the spec's own playtesting
  step — "your pod plays it cold... you stay quiet until someone has finished
  it or given up" — hasn't happened, and the required "one change that came
  from playing the finished game rather than reading its code" hasn't been
  made. The likely candidates are the three difficulty constants in
  `game.ts` (`BASE_INTERVAL_MS`, `MIN_INTERVAL_MS`, `INTERVAL_STEP_MS`), which
  are reasoned-about starting guesses, not tuned numbers, and the HUD's
  contrast against the RED/WON/LOST backgrounds. **Before submission:** play
  it cold (or watch someone else do it), make one real change based on what
  that shows, commit it separately with a message that says what the playtest
  revealed, and add that commit's citation to this file and to
  `reflections/crit-5.md`.
- **No headless browser is available in this sandbox** to click-test the
  interaction directly — Playwright's Chromium is present but its system
  shared libraries aren't installed and there's no `sudo` here. Verification
  so far is `pnpm check` plus reading the built `dist/index.html` and
  compiled JS by hand, which is not the same as watching someone actually
  play. This is exactly why the playtesting step above still has to happen
  with a real person, not be declared done from the code.

## Before you ship

`pnpm check:evidence` verifies your citations resolve to real commits, that a
reflection entry the marker reads is in `reflections/`, and that your
`CLAUDE.md` is there — before a marker ever opens the file. It checks that
your map is traceable, not that it is good: the marker judges whether your
small, deliberately chosen set of moments shows real judgement and reflection.
A green check is not a substitute for that curation.

Images aren't checked: unlike a citation whose SHA doesn't resolve, a broken
image is visible the moment this file is rendered on GitHub.
