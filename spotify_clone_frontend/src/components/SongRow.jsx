import React from 'react';
import { getAlbumTitle, getArtistName } from '../data/mockData.js';
import { usePlayer } from '../state/PlayerContext.jsx';

function formatTime(sec) {
  const s = Math.round(sec || 0);
  const m = Math.floor(s / 60);
  const r = String(s % 60).padStart(2, '0');
  return `${m}:${r}`;
}

export default function SongRow({ song, index, queueSongIds }) {
  const { currentSong, state, actions } = usePlayer();
  const isCurrent = currentSong?.id === song.id;
  const isPlaying = isCurrent && state.isPlaying;

  return (
    <div
      className={[
        'group grid grid-cols-[36px_1fr_1fr_64px] gap-3 items-center',
        'rounded-md px-3 py-2 transition',
        isCurrent ? 'bg-white/10' : 'hover:bg-white/5'
      ].join(' ')}
    >
      <div className="text-xs text-appMuted tabular-nums">
        <button
          type="button"
          onClick={() => actions.playSongIds(queueSongIds, song.id)}
          className={[
            'w-7 h-7 rounded-md border border-white/10',
            'grid place-items-center transition',
            'bg-white/5 hover:bg-white/10',
            'group-hover:border-white/20',
            isCurrent ? 'text-white' : 'text-appMuted hover:text-white'
          ].join(' ')}
          aria-label={isPlaying ? 'Playing' : 'Play song'}
          title={isPlaying ? 'Playing' : 'Play'}
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>
      </div>

      <div className="min-w-0">
        <div className="text-sm font-medium truncate">{song.title}</div>
        <div className="text-xs text-appMuted truncate">{getArtistName(song.artistId)}</div>
      </div>

      <div className="min-w-0 text-xs text-appMuted truncate hidden md:block">
        {getAlbumTitle(song.albumId)}
      </div>

      <div className="text-xs text-appMuted tabular-nums text-right">{formatTime(song.durationSec)}</div>
    </div>
  );
}
