import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUi } from '../state/UiContext.jsx';

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMiniPlayer, setIsMiniPlayer } = useUi();

  const [q, setQ] = useState('');

  const placeholder = useMemo(() => {
    if (location.pathname.startsWith('/search')) return 'Search songs, artists, albums...';
    return 'Quick search (opens Search)';
  }, [location.pathname]);

  function onSubmit(e) {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-appSurface/60 backdrop-blur">
      <div className="flex items-center gap-3 px-4 md:px-6 py-3">
        <div className="md:hidden text-sm font-semibold">Spotify Clone</div>

        <form onSubmit={onSubmit} className="flex-1">
          <label className="sr-only" htmlFor="topbar-search">
            Search
          </label>
          <input
            id="topbar-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-appAccent/60 focus:ring-2 focus:ring-appAccent/20 transition"
          />
        </form>

        <button
          type="button"
          onClick={() => setIsMiniPlayer((v) => !v)}
          className="rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-appMuted hover:text-white hover:bg-white/10 transition"
        >
          {isMiniPlayer ? 'Full Player' : 'Mini Player'}
        </button>

        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-appMuted hover:text-white hover:bg-white/10 transition hidden md:inline-block"
        >
          Back
        </button>
      </div>
    </header>
  );
}
