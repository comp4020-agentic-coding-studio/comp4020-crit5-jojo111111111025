import { type GameState, click, initialState, intervalFor, TARGET_SCORE } from "./game";

const surface = document.querySelector<HTMLElement>("#surface");
const action = document.querySelector<HTMLButtonElement>("#action");
const score = document.querySelector<HTMLElement>("#score");
const stateText = document.querySelector<HTMLElement>("#state");

if (surface && action && score && stateText) {
  let state: GameState = initialState();
  let timer: ReturnType<typeof setTimeout> | undefined;

  function render(): void {
    surface!.dataset.phase = state.phase;
    score!.textContent = `${state.score} / ${TARGET_SCORE}`;
    stateText!.textContent =
      state.phase === "won" ? "YOU WIN" : state.phase === "lost" ? "TOO EARLY" : state.phase === "green" ? "GREEN — GO" : "RED — WAIT";
  }

  function scheduleFlip(): void {
    clearTimeout(timer);
    if (state.phase !== "green" && state.phase !== "red") return;
    timer = setTimeout(() => {
      state = { ...state, phase: state.phase === "green" ? "red" : "green" };
      render();
      scheduleFlip();
    }, intervalFor(state.score));
  }

  // The same button doubles as restart once the round is over — it's the
  // only control on screen, so there's nothing else for that to be.
  function act(): void {
    state = state.phase === "won" || state.phase === "lost" ? initialState() : click(state);
    render();
    scheduleFlip();
  }

  action.addEventListener("click", act);

  render();
  scheduleFlip();
}
