// Data is imported statically and bundled with the app — code and data stay
// atomically consistent, and no "Loading…" state is needed.
import crashes from "../../data/crashes.json";
import forecasts from "../../data/forecasts.json";
import doomers from "../../data/doomers.json";
import psychology from "../../data/psychology.json";
import oracles from "../../data/oracles.json";

export const appData = {
  crashes,
  forecasts,
  doomers,
  psychology,
  oracles,
};
