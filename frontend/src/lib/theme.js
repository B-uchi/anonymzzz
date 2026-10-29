import { useCallback, useSyncExternalStore } from "react";

const KEY = "anonymzzz.theme";
const media = window.matchMedia("(prefers-color-scheme: dark)");
const listeners = new Set();

const resolved = () =>
  document.documentElement.dataset.theme || (media.matches ? "dark" : "light");

const subscribe = (listener) => {
  listeners.add(listener);
  media.addEventListener("change", listener);
  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", listener);
  };
};

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, resolved);

  const toggle = useCallback(() => {
    const next = resolved() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // Not persisted; the choice still applies for this visit.
    }
    listeners.forEach((listener) => listener());
  }, []);

  return { theme, toggle };
}
