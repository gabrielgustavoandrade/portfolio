import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './styles/tokens.css';

// Console note for curious developers
console.log(
  '%cHey there, curious developer.',
  'font-size: 16px; font-weight: 600; color: #f2ebe0;',
);
console.log(
  '%cReact 18 + TypeScript + Vite · live Earth in Three.js · smart-date-input from npm.\nSay hi: gabrielgustavoandrade@gmail.com',
  'color: #8b93a7;',
);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Production pages are prerendered (scripts/prerender.mjs); dev starts empty.
if (rootElement.firstElementChild) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
