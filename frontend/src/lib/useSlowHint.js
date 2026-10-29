import { useEffect, useState } from "react";

// The API runs on a free host that sleeps when idle; the first request can take
// most of a minute. Say so instead of leaving people staring at a spinner.
export function useSlowHint(active, delay = 4000) {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => setSlow(true), delay);
    return () => {
      clearTimeout(timer);
      setSlow(false);
    };
  }, [active, delay]);
  return slow;
}
