// Data is imported statically and bundled with the app — code and data stay
// atomically consistent, and there is never a loading state.
import worstdays from "../../data/worstdays.json";
import forecasts from "../../data/forecasts.json";
import roster from "../../data/roster.json";

export const appData = { worstdays, forecasts, roster };
