/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        appBg: '#0b0f14',
        appSurface: '#111827',
        appSurface2: '#0f172a',
        appText: '#e5e7eb',
        appMuted: '#94a3b8',
        appAccent: '#3b82f6',
        appAccent2: '#06b6d4'
      }
    }
  },
  plugins: []
};
