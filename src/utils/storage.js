// localStorage helpers for per-viewer preferences. Reads and writes can fail in private
// windows or when site data is blocked, so every access falls back to a default.

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch (e) {
    return fallback
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    // Preferences are a convenience; ignore write failures.
  }
}
