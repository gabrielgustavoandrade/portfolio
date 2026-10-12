import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
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

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
