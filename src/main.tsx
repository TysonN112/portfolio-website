import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// vite.config.js
export default {
  build: {
    rollupOptions: {
      external: [
        '/src/main.tsx'
      ]
    }
  }
};