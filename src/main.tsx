import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/tokens.css';
import './styles/utilities/index.css';

// Console easter egg for curious developers
console.log(
  '%c👋 Hey there, curious developer!',
  'font-size: 24px; font-weight: bold; color: #60a5fa; text-shadow: 2px 2px 4px rgba(96, 165, 250, 0.3);',
);
console.log(
  '%c\n🛠️ Tech Stack\n' + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  'font-size: 14px; color: #94a3b8; font-weight: bold;',
);
console.log(
  '%c• Frontend:%c React 18 + TypeScript + Vite\n' +
    '%c• Routing:%c React Router v6 with CSS transitions\n' +
    '%c• Animations:%c Custom CSS + Intersection Observer\n' +
    '%c• Performance:%c Code splitting, lazy loading, optimized assets',
  'color: #60a5fa; font-weight: bold;',
  'color: #e2e8f0;',
  'color: #60a5fa; font-weight: bold;',
  'color: #e2e8f0;',
  'color: #60a5fa; font-weight: bold;',
  'color: #e2e8f0;',
  'color: #60a5fa; font-weight: bold;',
  'color: #e2e8f0;',
);
console.log(
  '%c\n⚡ Performance Metrics\n' + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  'font-size: 14px; color: #94a3b8; font-weight: bold;',
);
console.log(
  '%c• Lighthouse Score:%c 95+ Performance | 100 Accessibility\n' +
    '%c• Build Size:%c 200KB gzipped (732KB total)\n' +
    '%c• FCP:%c < 1.8s | %cINP:%c < 200ms\n' +
    '%c• Animations:%c 60fps maintained',
  'color: #10b981; font-weight: bold;',
  'color: #e2e8f0;',
  'color: #10b981; font-weight: bold;',
  'color: #e2e8f0;',
  'color: #10b981; font-weight: bold;',
  'color: #e2e8f0;',
  'color: #10b981; font-weight: bold;',
  'color: #e2e8f0;',
  'color: #10b981; font-weight: bold;',
  'color: #e2e8f0;',
);
console.log(
  '%c\n🎨 Features\n' + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  'font-size: 14px; color: #94a3b8; font-weight: bold;',
);
console.log(
  '%c• Magnetic cursor effects on all interactive elements\n' +
    '• Smooth page transitions with CSS crossfade\n' +
    '• Scroll-triggered reveal animations\n' +
    '• Intersection Observer for lazy animations\n' +
    '• Accessibility: full keyboard nav + reduced motion support',
  'color: #e2e8f0; line-height: 1.6;',
);
console.log(
  '%c\n💼 Interested in working together?\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  'font-size: 14px; color: #94a3b8; font-weight: bold;',
);
console.log(
  '%cCheck out the contact section below or reach out directly!',
  'color: #60a5fa; font-size: 13px;',
);
console.log(
  '%c\n🎯 Pro tip:%c Type %cperformance.getEntriesByType("navigation")%c to see detailed page load metrics!',
  'color: #fbbf24; font-weight: bold;',
  'color: #94a3b8;',
  'color: #10b981; font-family: monospace; background: #1e293b; padding: 2px 6px; border-radius: 3px;',
  'color: #94a3b8;',
);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
