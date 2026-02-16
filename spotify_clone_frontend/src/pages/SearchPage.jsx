import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { artists, albums, songs, getArtistName, getAlbumTitle } from '../data/mockData.js';
import SongRow from '../components/SongRow.jsx';

function includesInsensitive(haystack, needle) {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q0 = searchParams.get('q') ?? '';
  const [q, setQ] = useState(q0);

  const results = useMemo(() => {
    const query = q.trim();
    if (!query) return { songs: [], artists: [], albums: [] };

    return {
      songs: songs.filter(
        (s) =>
          includesInsensitive(s.title, query) ||
          includesInsensitive(getArtistName(s.artistId), query) ||
          includesInsensitive(getAlbumTitle(s.albumId), query)
      ),
      artists: artists.filter((a) => includesInsensitive(a.name, query)),
      albums: albums.filter(
        (a) => includesInsensitive(a.title, query) || includesInsensitive(getArtistName(a.artistId), query)
      )
    };
  }, [q]);

  function onSubmit(e) {
    e.preventDefault();
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('q', q);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Search</h1>
        <p className="text-sm text-appMuted mt-1">Search across songs, artists, and albums.</p>
      </div>

      <form onSubmit={onSubmit} className="flex gap-2">
        <label className="sr-only" htmlFor="search-input">
          Search
        </label>
        <input
          id="search-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-appAccent/60 focus:ring-2 focus:ring-appAccent/20 transition"
          placeholder="Type to search..."
        />
        <button
          type="submit"
          className="rounded-md bg-appAccent/20 border border-appAccent/40 hover:bg-appAccent/30 px-4 py-2 text-sm transition"
        >
          Search
        </button>
      </form>

      {!q.trim() ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-appMuted">
          Try searching for “Glow”, “Night”, or an artist name.
        </div>
      ) : (
        <div className="space-y-6">
          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Songs</h2>
            {results.songs.length === 0 ? (
              <div className="text-sm text-appMuted">No songs found.</div>
            ) : (
              <div className="space-y-2">
                {results.songs.map((song, idx) => (
                  <SongRow key={song.id} song={song} index={idx} queueSongIds={songs.map((s) => s.id)} />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Artists</h2>
            {results.artists.length === 0 ? (
              <div className="text-sm text-appMuted">No artists found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.artists.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition p-4"
                  >
                    <div className="text-sm font-semibold">{a.name}</div>
                    <div className="text-xs text-appMuted mt-1">Artist</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Albums</h2>
            {results.albums.length === 0 ? (
              <div className="text-sm text-appMuted">No albums found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.albums.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition p-4"
                  >
                    <div className="text-sm font-semibold">{a.title}</div>
                    <div className="text-xs text-appMuted mt-1">{getArtistName(a.artistId)}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
