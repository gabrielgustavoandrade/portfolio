# Gabriel Andrade Portfolio

A fast, minimal, text-driven portfolio SPA built with React, TypeScript, and native View Transitions.

## Stack

- **Framework**: React 18
- **Bundler**: Vite
- **Router**: React Router v6
- **Language**: TypeScript
- **Styling**: CSS with custom design tokens
- **Transitions**: Native View Transitions API with fallback

## Features

- ✨ Smooth inline view transitions between project list and detail views
- 🎨 Monochrome minimalist design system
- ♿ Fully accessible with ARIA labels, focus management, and keyboard navigation
- 📱 Responsive design (mobile < 640px, desktop ≥ 640px)
- ⚡ Performance optimized (target: FCP < 1.2s, TTI < 2.5s, bundle < 100KB)
- 🌐 Respects `prefers-reduced-motion`

## Getting Started

### Install dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view in browser.

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Project Structure

```
/src
  /components
    Hero.tsx              # Landing hero section
    WorkList.tsx          # Project cards list
    WorkDetail.tsx        # Inline project detail view
    About.tsx             # About section
    Contact.tsx           # Contact section with CTA
    Footer.tsx            # Footer
  /data
    projects.ts           # Project data model and seed
  /hooks
    useViewTransition.ts  # View Transitions API hook
  /styles
    tokens.css            # Design system tokens
  App.tsx                 # Main app component
  main.tsx                # Entry point
```

## Customization

### Update Contact Details

Edit `/src/components/Contact.tsx`:
- Change `mailto:your.email@example.com` to your email
- Update LinkedIn URL

### Add Projects

Edit `/src/data/projects.ts` to add or modify projects following the `Project` interface.

## Deployment

This project is configured for Vercel with SPA fallback support via `vercel.json`.

```bash
vercel deploy
```

For other platforms, ensure your hosting supports SPA routing (redirect all routes to `index.html`).

## Browser Support

- View Transitions: Chrome/Edge 111+
- Fallback: Opacity-only transitions for Safari/Firefox

## Performance Targets

- First Contentful Paint (FCP): < 1.2s
- Time to Interactive (TTI): < 2.5s
- Bundle size: < 100KB
- Lighthouse scores: ≥ 95 (Performance & Accessibility)

## License

© Gabriel Andrade 2025
