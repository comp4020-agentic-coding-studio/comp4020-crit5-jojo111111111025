# Crit 5 reflection

**What I built.** Reaction Rush is a small full-screen reflex game designed
around one simple mechanic: the screen alternates between GREEN and RED.
During GREEN, the player clicks the central button to score one point; the
successful click immediately changes the screen to RED. During RED, the
player must wait. Clicking during RED causes an immediate loss. Reaching 10
successful GREEN clicks wins the game. The switching interval becomes shorter
as the score increases, making the game progressively harder without adding
extra mechanics.

**How the design changed.** The initial implementation was different from the
final interface. The first version treated the whole screen as the
interaction surface and used progress dots to represent progress. I then
directed the interface toward a simpler interaction model: the full-screen
colour should remain the main visual signal, but there should be only one
large central button. I also requested a small game title, the purpose
statement "Train your reaction speed", the current score, and a short state
indicator. These elements were deliberately kept secondary to the colour and
button so that the interface remained immediately understandable without a
tutorial. These changes are captured in commit `6eb86cb`.

An important implementation change also came from examining the interaction
model before finalising it. The first version used a clickable surface with a
restart button nested inside it, which created the possibility of click
events bubbling from the restart control into the game. Instead of adding
more event-handling exceptions, I directed the implementation toward a single
native button that also becomes the restart control after the game ends. This
simplified the interaction model and provided keyboard focus and activation
behaviour through the native button. This decision is also reflected in
`6eb86cb`.

**How the game rule was grounded in testing.** The main rule selected for
automated testing is that clicking during RED causes the game to enter the
LOST state. This is the clearest failure condition in the game and directly
demonstrates that the game can be lost. The GREEN interaction is also tested:
a successful click increases the score and moves the game to RED, while the
tenth successful click produces a WIN. The game logic is kept in pure
functions in `game.ts`, allowing these rules to be tested independently from
the DOM and timer implementation. These tests were added in commit `4850680`.

**How I directed the agent.** I used the agent to inspect the course
requirements, establish the Astro project structure, implement the state
machine, write the focused tests, and develop the interface. I made the key
design decisions rather than asking the agent to invent the entire game: the
game would use one mechanic, the screen would alternate between GREEN and
RED, the central button would be the only main interaction, and the interface
would communicate the game's purpose without providing a tutorial. I also
corrected the initial interaction model when it did not match the intended
experience.

**Playtesting.** I played the finished build cold, without reading the code
first. After losing a round, I wasn't sure the central button was what I was
supposed to click to play again — the button has no label in any state, and
the only on-screen cue after a loss is the small "TOO EARLY" HUD text, which
doesn't say what to do next. That observation led directly to a UI change:
the button now shows "RESTART" (and gets `aria-label="Restart"`) only while
the game is in the LOST state, since that's where the ambiguity actually
showed up; every other phase keeps the button unlabelled, and the WON state
and the core GREEN/RED mechanic are unchanged. This is captured in commit
`1c96295`.
