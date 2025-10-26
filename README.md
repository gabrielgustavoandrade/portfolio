# Portfolio

My personal portfolio site. Fast, minimal, and built with intention.

## What's Inside

**Frontend**: React 18 + TypeScript + Vite
**Routing**: React Router v6 with CSS transitions
**Styling**: Custom utility-first CSS system with design tokens
**3D**: Three.js for the interactive Earth
**Performance**: Code splitting, lazy loading, 60fps animations

## Why This Stack?

No Next.js. No CSS-in-JS. No heavy animation libraries.

I built this portfolio to showcase what's possible with thoughtful architecture and plain web technologies. Every dependency is justified. Every performance decision is deliberate.

- **Vite** for instant HMR and simple configuration
- **Plain CSS** with custom properties for zero-runtime styling
- **Utility-first approach** with 14 custom modules (no Tailwind bloat)
- **Design tokens** for consistency (40+ CSS variables)
- **Custom animations** using Intersection Observer and RAF
- **Three.js** for WebGL—the only "heavy" dependency at ~500KB

**Bundle**: 736KB total, 202KB gzipped
**Lighthouse**: 95+ Performance, 100 Accessibility

## Getting Started

```bash
# Install
bun install

# Dev
bun run dev

# Build
bun run build

# Preview
bun run preview
```

## Project Structure

```
/src
  /components       # UI components
  /data            # Project & tech stack data
  /hooks           # Custom React hooks
  /routes          # Page routes
  /styles
    /utilities     # 14 CSS utility modules
    tokens.css     # Design system
  App.tsx
  main.tsx
```

## Features Worth Noting

**Performance**
- Route-based code splitting
- Intersection Observer for lazy animations
- RequestAnimationFrame for smooth 60fps
- Passive event listeners on scroll
- CSS containment for expensive renders

**Styling**
- Comprehensive design token system
- Zero runtime CSS (no CSS-in-JS overhead)
- Utility-first approach with composable patterns
- Single source of truth for all design values

**UX**
- Magnetic cursor effects on interactive elements
- Smooth page transitions with CSS crossfade
- Scroll-triggered reveal animations
- Full keyboard navigation
- Respects `prefers-reduced-motion`

**Accessibility**
- Semantic HTML
- ARIA labels and roles
- WCAG AAA color contrast
- Focus management
- Screen reader support

## Customization

Edit `/src/data/projects.ts` to update projects.
Edit `/src/data/techStack.ts` to update tech details.
Edit `/src/components/Contact.tsx` for contact info.

All styling lives in `/src/styles/tokens.css` and `/src/styles/utilities/`.

## Deployment

Configured for Vercel with SPA routing support via `vercel.json`.

```bash
vercel deploy
```

For other platforms, ensure SPA routing (redirect all routes to `index.html`).

## Console Easter Egg

Open DevTools and check the console. I left something for curious developers.

---

Built with attention to detail.
© Gabriel Andrade 2025
