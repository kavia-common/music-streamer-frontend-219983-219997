import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { playlists, songs } from '../data/mockData.js';
import { loadRecentlyPlayed } from '../utils/localStorage.js';
import SongRow from '../components/SongRow.jsx';

export default function LibraryPage() {
  const recentlyIds = useMemo(() => loadRecentlyPlayed(), []);
  const recentlySongs = useMemo(() => {
    const map = new Map(songs.map((s) => [s.id, s]));
    return recentlyIds.map((id) => map.get(id)).filter(Boolean);
  }, [recentlyIds]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Your Library</h1>
        <p className="text-sm text-appMuted mt-1">Playlists and recently played tracks.</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Playlists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {playlists.map((p) => (
            <Link
              key={p.id}
              to={`/playlist/${p.id}`}
              className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition p-4"
            >
              <div className="text-sm font-semibold">{p.name}</div>
              <div className="text-xs text-appMuted mt-1">{p.description}</div>
              <div className="text-xs text-appMuted mt-3">{p.songIds.length} songs</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recently played</h2>
        {recentlySongs.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-appMuted">
            Nothing here yet—play a few songs and come back.
          </div>
        ) : (
          <div className="space-y-2">
            {recentlySongs.slice(0, 10).map((song, idx) => (
              <SongRow key={song.id} song={song} index={idx} queueSongIds={songs.map((s) => s.id)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
