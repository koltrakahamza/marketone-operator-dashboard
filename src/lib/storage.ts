// Browser storage is a convenience for the demo, never an authentication boundary.
export function readSession(key: string): unknown {
  try {
    return JSON.parse(sessionStorage.getItem(key) ?? 'null');
  } catch {
    return null;
  }
}

export function saveSession(key: string, value: unknown): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* The app remains usable when storage is blocked or full. */
  }
}

export function removeSession(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* Storage may be unavailable in private browsing. */
  }
}
