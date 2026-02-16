import React from 'react';
import { usePlayer } from '../state/PlayerContext.jsx';

export default function MiniPlayer() {
  const { state, currentSong, actions } = usePlayer();

  return (
    <div className="h-full flex items-center justify-between px-4 md:px-6">
      <div className="min-w-0">
        <div className="text-sm font-semibold truncate">{currentSong?.title ?? 'Nothing playing'}</div>
        <div className="text-xs text-appMuted truncate">
          {currentSong ? 'Mini player mode' : 'Select a song'}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={actions.prev}
          className="rounded-md px-2 py-1 text-xs bg-white/5 border border-white/10 text-appMuted hover:text-white hover:bg-white/10 transition"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={actions.togglePlay}
          className="rounded-md px-4 py-2 text-sm bg-appAccent/20 border border-appAccent/40 hover:bg-appAccent/30 transition"
        >
          {state.isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          type="button"
          onClick={actions.next}
          className="rounded-md px-2 py-1 text-xs bg-white/5 border border-white/10 text-appMuted hover:text-white hover:bg-white/10 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
