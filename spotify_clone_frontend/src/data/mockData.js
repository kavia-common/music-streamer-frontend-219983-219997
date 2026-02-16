/**
 * Mock data for the Spotify Clone frontend.
 * Note: In a real app these would come from an API.
 */

export const artists = [
  { id: 'a1', name: 'Neon Skyline' },
  { id: 'a2', name: 'Midnight Circuit' },
  { id: 'a3', name: 'Ocean Bloom' }
];

export const albums = [
  { id: 'al1', title: 'Blue Hour', artistId: 'a1', year: 2022 },
  { id: 'al2', title: 'Night Drive', artistId: 'a2', year: 2023 },
  { id: 'al3', title: 'Coastal Lines', artistId: 'a3', year: 2021 }
];

export const songs = [
  {
    id: 's1',
    title: 'Glow',
    artistId: 'a1',
    albumId: 'al1',
    durationSec: 206,
    // Public domain sample:
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 's2',
    title: 'Soft Signals',
    artistId: 'a2',
    albumId: 'al2',
    durationSec: 185,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 's3',
    title: 'Tidepool',
    artistId: 'a3',
    albumId: 'al3',
    durationSec: 233,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: 's4',
    title: 'Photon',
    artistId: 'a1',
    albumId: 'al1',
    durationSec: 199,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    id: 's5',
    title: 'Bypass',
    artistId: 'a2',
    albumId: 'al2',
    durationSec: 214,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  }
];

export const playlists = [
  {
    id: 'p1',
    name: 'Daily Mix',
    description: 'A mix of tracks you might like.',
    songIds: ['s1', 's2', 's3', 's4', 's5']
  },
  {
    id: 'p2',
    name: 'Focus',
    description: 'Stay in the zone with minimal vocals.',
    songIds: ['s3', 's1', 's4']
  }
];

export function getArtistName(artistId) {
  return artists.find((a) => a.id === artistId)?.name ?? 'Unknown Artist';
}

export function getAlbumTitle(albumId) {
  return albums.find((a) => a.id === albumId)?.title ?? 'Unknown Album';
}

export function getSongsByIds(songIds) {
  const map = new Map(songs.map((s) => [s.id, s]));
  return songIds.map((id) => map.get(id)).filter(Boolean);
}
