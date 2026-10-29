const relative = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
const absolute = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const STEPS = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

export function timeAgo(date) {
  const seconds = (new Date(date).getTime() - Date.now()) / 1000;
  for (const [unit, size] of STEPS) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
  }
  return "just now";
}

export const fullDate = (date) => absolute.format(new Date(date));

export const profilePath = (username) => `/u/${encodeURIComponent(username)}`;
export const profileUrl = (username) => `${window.location.origin}${profilePath(username)}`;
export const displayHost = () => window.location.host;

export const USERNAME_PATTERN = /^[a-zA-Z0-9_.]{3,20}$/;
export const MESSAGE_MAX_LENGTH = 1000;
export const PROMPT_MAX_LENGTH = 120;

// Small, stable tilt per message so a wall of notes doesn't look machine-stacked.
export function tiltFor(id = "") {
  let hash = 0;
  for (const char of String(id)) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return ((Math.abs(hash) % 13) - 6) / 10;
}
