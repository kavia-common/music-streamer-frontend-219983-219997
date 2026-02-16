import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PUBLIC_INTERFACE
export default defineConfig({
  /** Vite config for Spotify Clone frontend. */
  plugins: [react()],
  server: {
    port: Number(process.env.REACT_APP_PORT || 3000),
    strictPort: true,
    host: true
  }
});
