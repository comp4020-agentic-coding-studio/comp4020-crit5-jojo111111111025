import { describe, expect, it } from "vitest";
import { TARGET_SCORE, click } from "../src/scripts/game";

// Crit 5 spec: https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/crits/05-game/
// Only the mechanically-checkable game rule is covered here — whether the
// five-minute, no-tutorial promise actually holds for a stranger is for a
// human to judge at the crit, not something a test can assert.

describe("crit 5: a wrong move ends the round", () => {
  it("clicking during red loses immediately, regardless of score", () => {
    const state = { phase: "red", score: 6 } as const;
    expect(click(state)).toEqual({ phase: "lost", score: 6 });
  });
});

describe("crit 5: a successful click consumes the green window", () => {
  it("clicking during green scores and flips to red, not another green", () => {
    const state = { phase: "green", score: 3 } as const;
    expect(click(state)).toEqual({ phase: "red", score: 4 });
  });

  it(`the ${TARGET_SCORE}th successful click wins instead of flipping to red`, () => {
    const state = { phase: "green", score: TARGET_SCORE - 1 } as const;
    expect(click(state)).toEqual({ phase: "won", score: TARGET_SCORE });
  });
});
