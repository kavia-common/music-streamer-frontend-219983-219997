const RECENTLY_PLAYED_KEY = 'spotify_clone_recently_played_v1';

// PUBLIC_INTERFACE
export function loadRecentlyPlayed() {
  /** Load recently played song IDs from localStorage. */
  try {
    const raw = localStorage.getItem(RECENTLY_PLAYED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export function pushRecentlyPlayed(songId, maxItems = 30) {
  /** Push a song ID to the front of recently played list. */
  const current = loadRecentlyPlayed();
  const next = [songId, ...current.filter((id) => id !== songId)].slice(0, maxItems);
  try {
    localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(next));
  } catch {
    // ignore storage errors (e.g., private browsing)
  }
  return next;
}
