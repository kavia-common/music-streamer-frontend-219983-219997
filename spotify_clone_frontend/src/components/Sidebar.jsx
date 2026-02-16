import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUi } from '../state/UiContext.jsx';
import { playlists } from '../data/mockData.js';

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'block rounded-md px-3 py-2 text-sm font-medium transition',
          isActive ? 'bg-white/10 text-white' : 'text-appMuted hover:text-white hover:bg-white/5'
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  );
}

export default function Sidebar() {
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useUi();

  return (
    <aside
      className={[
        'h-full border-r border-white/10 bg-appSurface2/60 backdrop-blur',
        'transition-all duration-300',
        isSidebarCollapsed ? 'w-[72px]' : 'w-[260px]',
        'hidden md:flex flex-col'
      ].join(' ')}
    >
      <div className="flex items-center justify-between px-3 py-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold tracking-wide truncate">
            {isSidebarCollapsed ? 'SC' : 'Spotify Clone'}
          </div>
          {!isSidebarCollapsed && (
            <div className="text-xs text-appMuted truncate">Music streamer</div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsSidebarCollapsed((v) => !v)}
          className="rounded-md px-2 py-1 text-xs text-appMuted hover:text-white hover:bg-white/5 transition"
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? '»' : '«'}
        </button>
      </div>

      <nav className="px-2 space-y-1">
        <NavItem to="/" label="Home" />
        <NavItem to="/search" label="Search" />
        <NavItem to="/library" label="Your Library" />
      </nav>

      {!isSidebarCollapsed && (
        <div className="mt-5 px-2">
          <div className="px-3 text-xs uppercase tracking-wider text-appMuted mb-2">Playlists</div>
          <div className="space-y-1">
            {playlists.map((p) => (
              <NavItem key={p.id} to={`/playlist/${p.id}`} label={p.name} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto px-3 py-3 text-xs text-appMuted">
        {!isSidebarCollapsed ? 'Tip: Drag to reorder songs in playlists.' : 'Drag'}
      </div>
    </aside>
  );
}
