// Pure GREEN/RED reflex game rules — no DOM, no timers, so the core rules
// are testable in isolation from rendering and from real-world timing.
//
// Core loop: GREEN -> click -> RED -> timer flip -> GREEN -> ...
// A successful click consumes its GREEN window immediately, so repeated
// clicks inside one window can't double-score. A RED click always loses.

export type Phase = "green" | "red" | "won" | "lost";

export interface GameState {
  phase: Phase;
  score: number;
}

export const TARGET_SCORE = 10;
export const BASE_INTERVAL_MS = 1200; // interval at score 0
export const MIN_INTERVAL_MS = 400; // floor, never gets faster than this
export const INTERVAL_STEP_MS = 80; // shaved off per point scored

export function initialState(): GameState {
  return { phase: "green", score: 0 };
}

export function click(state: GameState): GameState {
  if (state.phase === "green") {
    const score = state.score + 1;
    return score >= TARGET_SCORE ? { phase: "won", score } : { phase: "red", score };
  }
  if (state.phase === "red") {
    return { phase: "lost", score: state.score };
  }
  return state;
}

export function flip(state: GameState): GameState {
  if (state.phase === "green") return { ...state, phase: "red" };
  if (state.phase === "red") return { ...state, phase: "green" };
  return state;
}

export function intervalFor(score: number): number {
  return Math.max(MIN_INTERVAL_MS, BASE_INTERVAL_MS - score * INTERVAL_STEP_MS);
}
