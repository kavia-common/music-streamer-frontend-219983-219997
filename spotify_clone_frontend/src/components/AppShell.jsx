import React from 'react';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import PlayerBar from './PlayerBar.jsx';
import MiniPlayer from './MiniPlayer.jsx';
import { useUi } from '../state/UiContext.jsx';

export default function AppShell({ children }) {
  const { isSidebarCollapsed, isMiniPlayer } = useUi();

  return (
    <div className="h-screen w-screen bg-appBg text-appText overflow-hidden">
      <div className="flex h-[calc(100%-96px)]">
        <Sidebar />
        <div
          className={[
            'flex flex-col flex-1 min-w-0',
            isSidebarCollapsed ? '' : ''
          ].join(' ')}
        >
          <Topbar />
          <main className="flex-1 min-w-0 overflow-y-auto px-4 md:px-6 py-4">
            {children}
          </main>
        </div>
      </div>

      <div className="h-[96px] border-t border-white/10 bg-appSurface/80 backdrop-blur">
        {isMiniPlayer ? <MiniPlayer /> : <PlayerBar />}
      </div>
    </div>
  );
}
