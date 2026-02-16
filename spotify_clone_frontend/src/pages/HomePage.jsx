import React from 'react';
import { Link } from 'react-router-dom';
import { playlists, songs } from '../data/mockData.js';
import SongRow from '../components/SongRow.jsx';
import { usePlayer } from '../state/PlayerContext.jsx';

export default function HomePage() {
  const { actions } = usePlayer();

  const quickPick = songs.slice(0, 5);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-gray-50/5 p-5">
        <div className="text-sm text-appMuted">Welcome back</div>
        <h1 className="text-2xl font-bold mt-1">Good afternoon</h1>
        <p className="text-sm text-appMuted mt-2 max-w-2xl">
          This is a mock Spotify-like experience with a real HTML5 audio player, smooth transitions,
          and local recently played.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => actions.playSongIds(songs.map((s) => s.id), songs[0].id)}
            className="rounded-md bg-appAccent/20 border border-appAccent/40 hover:bg-appAccent/30 px-4 py-2 text-sm transition"
          >
            Play something
          </button>
          <Link
            to="/search"
            className="rounded-md bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 text-sm transition"
          >
            Search
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Featured Playlists</h2>
          <Link to="/library" className="text-sm text-appMuted hover:text-white transition">
            See all
          </Link>
        </div>

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
        <h2 className="text-lg font-semibold">Quick picks</h2>
        <div className="space-y-2">
          {quickPick.map((song, idx) => (
            <SongRow key={song.id} song={song} index={idx} queueSongIds={songs.map((s) => s.id)} />
          ))}
        </div>
      </section>
    </div>
  );
}
