import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { playlists, songs, getSongsByIds } from '../data/mockData.js';
import SongRow from '../components/SongRow.jsx';
import { usePlayer } from '../state/PlayerContext.jsx';

function reorder(list, from, to) {
  const next = [...list];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export default function PlaylistPage() {
  const { playlistId } = useParams();
  const { actions } = usePlayer();

  const playlist = useMemo(() => playlists.find((p) => p.id === playlistId) ?? null, [playlistId]);
  const baseSongIds = playlist?.songIds ?? [];
  const [songIds, setSongIds] = useState(baseSongIds);
  const queueSongIds = songIds;

  const songList = useMemo(() => getSongsByIds(songIds), [songIds]);

  const [dragIndex, setDragIndex] = useState(null);

  if (!playlist) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-appMuted">
        Playlist not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-xs uppercase tracking-wider text-appMuted">Playlist</div>
        <h1 className="text-2xl font-bold mt-1">{playlist.name}</h1>
        <p className="text-sm text-appMuted mt-2">{playlist.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => actions.playSongIds(queueSongIds, queueSongIds[0])}
            className="rounded-md bg-appAccent/20 border border-appAccent/40 hover:bg-appAccent/30 px-4 py-2 text-sm transition"
          >
            Play
          </button>
          <button
            type="button"
            onClick={() => setSongIds(songs.map((s) => s.id).slice(0, 5))}
            className="rounded-md bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 text-sm transition"
          >
            Replace with top 5 mock songs
          </button>
        </div>
      </header>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Tracks</h2>
          <div className="text-sm text-appMuted">Drag & drop to reorder</div>
        </div>

        <div className="space-y-2">
          {songList.map((song, idx) => (
            <div
              key={song.id}
              draggable
              onDragStart={() => setDragIndex(idx)}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={() => {
                if (dragIndex === null || dragIndex === idx) return;
                setSongIds((prev) => reorder(prev, dragIndex, idx));
                setDragIndex(null);
              }}
              className={[
                'rounded-md',
                dragIndex === idx ? 'ring-2 ring-appAccent/40' : ''
              ].join(' ')}
              aria-label={`Reorder ${song.title}`}
              title="Drag to reorder"
            >
              <SongRow song={song} index={idx} queueSongIds={queueSongIds} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
