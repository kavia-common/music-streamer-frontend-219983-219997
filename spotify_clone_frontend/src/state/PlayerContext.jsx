import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { songs as allSongs } from '../data/mockData.js';
import { pushRecentlyPlayed } from '../utils/localStorage.js';

const PlayerContext = createContext(null);

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

function shuffled(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const initialState = {
  queue: allSongs.map((s) => s.id),
  currentIndex: 0,
  isPlaying: false,
  volume: 0.9,
  progressSec: 0,
  durationSec: 0,
  shuffle: false,
  repeat: 'off', // 'off' | 'one' | 'all'
  error: null
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_QUEUE': {
      return { ...state, queue: action.queue, currentIndex: action.currentIndex ?? 0 };
    }
    case 'PLAY_INDEX': {
      return { ...state, currentIndex: action.index, isPlaying: true, error: null, progressSec: 0 };
    }
    case 'TOGGLE_PLAY': {
      return { ...state, isPlaying: !state.isPlaying };
    }
    case 'SET_PLAYING': {
      return { ...state, isPlaying: action.isPlaying };
    }
    case 'SET_VOLUME': {
      return { ...state, volume: clamp01(action.volume) };
    }
    case 'SET_PROGRESS': {
      return { ...state, progressSec: Math.max(0, action.progressSec) };
    }
    case 'SET_DURATION': {
      return { ...state, durationSec: Math.max(0, action.durationSec) };
    }
    case 'TOGGLE_SHUFFLE': {
      return { ...state, shuffle: !state.shuffle };
    }
    case 'CYCLE_REPEAT': {
      const next = state.repeat === 'off' ? 'all' : state.repeat === 'all' ? 'one' : 'off';
      return { ...state, repeat: next };
    }
    case 'SET_ERROR': {
      return { ...state, error: action.error };
    }
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function PlayerProvider({ children }) {
  /** Provides audio playback state and controls using a single hidden <audio> element. */
  const [state, dispatch] = useReducer(reducer, initialState);
  const audioRef = useRef(null);

  const currentSongId = state.queue[state.currentIndex] ?? null;
  const currentSong = useMemo(
    () => allSongs.find((s) => s.id === currentSongId) ?? null,
    [currentSongId]
  );

  // Keep <audio> src in sync with current song.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentSong) {
      audio.removeAttribute('src');
      audio.load();
      return;
    }

    audio.src = currentSong.url;
    audio.load();
    dispatch({ type: 'SET_PROGRESS', progressSec: 0 });

    // Track recently played
    pushRecentlyPlayed(currentSong.id);

    if (state.isPlaying) {
      audio
        .play()
        .catch((err) =>
          dispatch({ type: 'SET_ERROR', error: err?.message ?? 'Unable to start playback.' })
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSongId]);

  // Apply playing/paused.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!currentSong) return;

    if (state.isPlaying) {
      audio
        .play()
        .catch((err) =>
          dispatch({ type: 'SET_ERROR', error: err?.message ?? 'Unable to start playback.' })
        );
    } else {
      audio.pause();
    }
  }, [state.isPlaying, currentSong]);

  // Apply volume.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = state.volume;
  }, [state.volume]);

  // Bind audio events once.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => dispatch({ type: 'SET_PROGRESS', progressSec: audio.currentTime || 0 });
    const onLoaded = () => dispatch({ type: 'SET_DURATION', durationSec: audio.duration || 0 });
    const onEnded = () => {
      if (state.repeat === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }

      const hasNext = state.currentIndex < state.queue.length - 1;
      if (hasNext) {
        dispatch({ type: 'PLAY_INDEX', index: state.currentIndex + 1 });
        return;
      }

      if (state.repeat === 'all' && state.queue.length > 0) {
        dispatch({ type: 'PLAY_INDEX', index: 0 });
        return;
      }

      dispatch({ type: 'SET_PLAYING', isPlaying: false });
    };
    const onError = () => dispatch({ type: 'SET_ERROR', error: 'Audio playback error.' });

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
    // Important: include repeat/currentIndex/queue so "ended" logic uses latest values.
  }, [state.repeat, state.currentIndex, state.queue.length]);

  const actions = useMemo(() => {
    return {
      playSongIds(songIds, startSongId) {
        const queue = songIds.length ? songIds : allSongs.map((s) => s.id);
        const startIndex = startSongId ? Math.max(0, queue.indexOf(startSongId)) : 0;
        dispatch({ type: 'SET_QUEUE', queue, currentIndex: startIndex });
        dispatch({ type: 'SET_PLAYING', isPlaying: true });
      },
      playIndex(index) {
        dispatch({ type: 'PLAY_INDEX', index });
      },
      togglePlay() {
        dispatch({ type: 'TOGGLE_PLAY' });
      },
      next() {
        const nextIndex =
          state.currentIndex < state.queue.length - 1 ? state.currentIndex + 1 : 0;
        dispatch({ type: 'PLAY_INDEX', index: nextIndex });
      },
      prev() {
        const prevIndex =
          state.currentIndex > 0 ? state.currentIndex - 1 : Math.max(0, state.queue.length - 1);
        dispatch({ type: 'PLAY_INDEX', index: prevIndex });
      },
      seek(progressSec) {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = Math.max(0, progressSec);
        dispatch({ type: 'SET_PROGRESS', progressSec: audio.currentTime });
      },
      setVolume(volume) {
        dispatch({ type: 'SET_VOLUME', volume });
      },
      toggleShuffle() {
        // Shuffle is applied by reordering queue while keeping current song at the front.
        if (!currentSongId) {
          dispatch({ type: 'TOGGLE_SHUFFLE' });
          return;
        }

        if (!state.shuffle) {
          const rest = state.queue.filter((id) => id !== currentSongId);
          const nextQueue = [currentSongId, ...shuffled(rest)];
          dispatch({ type: 'SET_QUEUE', queue: nextQueue, currentIndex: 0 });
          dispatch({ type: 'TOGGLE_SHUFFLE' });
        } else {
          // Restore to default order (allSongs), keep current song selected.
          const defaultQueue = allSongs.map((s) => s.id);
          const idx = Math.max(0, defaultQueue.indexOf(currentSongId));
          dispatch({ type: 'SET_QUEUE', queue: defaultQueue, currentIndex: idx });
          dispatch({ type: 'TOGGLE_SHUFFLE' });
        }
      },
      cycleRepeat() {
        dispatch({ type: 'CYCLE_REPEAT' });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentIndex, state.queue, state.shuffle, state.queue.length, currentSongId]);

  const value = useMemo(
    () => ({
      state,
      currentSong,
      audioRef,
      actions
    }),
    [state, currentSong, actions]
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      {/* Single audio element for the whole app */}
      <audio ref={audioRef} preload="metadata" />
    </PlayerContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function usePlayer() {
  /** Hook to access player context. */
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
