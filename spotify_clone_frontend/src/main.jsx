import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';
import { PlayerProvider } from './state/PlayerContext.jsx';
import { UiProvider } from './state/UiContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UiProvider>
        <PlayerProvider>
          <App />
        </PlayerProvider>
      </UiProvider>
    </BrowserRouter>
  </React.StrictMode>
);
