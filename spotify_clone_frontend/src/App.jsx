import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell.jsx';
import SkeletonPage from './components/SkeletonPage.jsx';

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const SearchPage = lazy(() => import('./pages/SearchPage.jsx'));
const LibraryPage = lazy(() => import('./pages/LibraryPage.jsx'));
const PlaylistPage = lazy(() => import('./pages/PlaylistPage.jsx'));

export default function App() {
  return (
    <AppShell>
      <Suspense fallback={<SkeletonPage />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/playlist/:playlistId" element={<PlaylistPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
