import React, { useMemo } from 'react';
import { getArtistName } from '../data/mockData.js';
import { usePlayer } from '../state/PlayerContext.jsx';

function formatTime(sec) {
  const s = Math.round(sec || 0);
  const m = Math.floor(s / 60);
  const r = String(s % 60).padStart(2, '0');
  return `${m}:${r}`;
}

export default function PlayerBar() {
  const { state, currentSong, actions } = usePlayer();

  const progressPct = useMemo(() => {
    if (!state.durationSec) return 0;
    return Math.round((state.progressSec / state.durationSec) * 100);
  }, [state.progressSec, state.durationSec]);

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-3 items-center px-4 md:px-6">
      <div className="min-w-0 hidden md:block">
        <div className="text-sm font-semibold truncate">{currentSong?.title ?? 'Nothing playing'}</div>
        <div className="text-xs text-appMuted truncate">
          {currentSong ? getArtistName(currentSong.artistId) : 'Pick a song to start listening'}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={actions.toggleShuffle}
            className={[
              'rounded-md px-2 py-1 text-xs border transition',
              state.shuffle
                ? 'bg-appAccent/20 border-appAccent/40 text-white'
                : 'bg-white/5 border-white/10 text-appMuted hover:text-white hover:bg-white/10'
            ].join(' ')}
          >
            Shuffle
          </button>

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

          <button
            type="button"
            onClick={actions.cycleRepeat}
            className={[
              'rounded-md px-2 py-1 text-xs border transition',
              state.repeat !== 'off'
                ? 'bg-appAccent2/20 border-appAccent2/40 text-white'
                : 'bg-white/5 border-white/10 text-appMuted hover:text-white hover:bg-white/10'
            ].join(' ')}
            title={`Repeat: ${state.repeat}`}
          >
            Repeat {state.repeat === 'one' ? '1' : state.repeat === 'all' ? 'All' : 'Off'}
          </button>
        </div>

        <div className="w-full max-w-[640px] flex items-center gap-2">
          <div className="text-[11px] text-appMuted tabular-nums w-10 text-right">
            {formatTime(state.progressSec)}
          </div>
          <input
            className="flex-1 accent-blue-400"
            type="range"
            min={0}
            max={Math.max(1, state.durationSec)}
            value={Math.min(state.progressSec, state.durationSec || 0)}
            onChange={(e) => actions.seek(Number(e.target.value))}
            aria-label="Seek"
          />
          <div className="text-[11px] text-appMuted tabular-nums w-10">
            {formatTime(state.durationSec)}
          </div>
        </div>

        {state.error && <div className="text-xs text-red-300">{state.error}</div>}
      </div>

      <div className="hidden md:flex items-center justify-end gap-3">
        <div className="text-xs text-appMuted">Queue: {state.queue.length}</div>
        <div className="w-[160px] flex items-center gap-2">
          <div className="text-xs text-appMuted">Vol</div>
          <input
            className="flex-1 accent-blue-400"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={state.volume}
            onChange={(e) => actions.setVolume(Number(e.target.value))}
            aria-label="Volume"
          />
        </div>
        <div className="text-xs text-appMuted w-12 text-right">{progressPct}%</div>
      </div>
    </div>
  );
}
