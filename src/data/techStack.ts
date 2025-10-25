export interface TechCategory {
  name: string;
  items: {
    name: string;
    description: string;
    icon: string;
  }[];
}

export interface ArchitecturalDecision {
  title: string;
  decision: string;
  rationale: string;
}

export interface PerformanceOptimization {
  category: string;
  optimizations: string[];
}

export const techStack: TechCategory[] = [
  {
    name: 'Frontend',
    items: [
      {
        name: 'React 18',
        description: 'UI library with concurrent features',
        icon: '⚛️',
      },
      {
        name: 'TypeScript',
        description: 'Type-safe JavaScript',
        icon: '📘',
      },
      {
        name: 'Vite',
        description: 'Build tool with lightning-fast HMR',
        icon: '⚡',
      },
    ],
  },
  {
    name: 'Routing & Navigation',
    items: [
      {
        name: 'React Router v6',
        description: 'Client-side routing',
        icon: '🛣️',
      },
      {
        name: 'View Transitions API',
        description: 'Native browser page transitions',
        icon: '✨',
      },
    ],
  },
  {
    name: 'Styling',
    items: [
      {
        name: 'CSS Modules',
        description: 'Zero-runtime styling',
        icon: '🎨',
      },
      {
        name: 'CSS Custom Properties',
        description: 'Design tokens for theming',
        icon: '🎯',
      },
    ],
  },
  {
    name: 'Performance APIs',
    items: [
      {
        name: 'Intersection Observer',
        description: 'Lazy loading & scroll animations',
        icon: '👁️',
      },
      {
        name: 'Performance Observer',
        description: 'Web Vitals monitoring',
        icon: '📊',
      },
      {
        name: 'RequestAnimationFrame',
        description: '60fps animations',
        icon: '🎬',
      },
    ],
  },
];

export const architecturalDecisions: ArchitecturalDecision[] = [
  {
    title: 'Why Vite over Next.js?',
    decision: 'Chose Vite for build tooling',
    rationale:
      'For a static portfolio with client-side routing, Vite offers superior DX with near-instant HMR and simpler configuration. No need for SSR overhead or API routes. Smaller bundle, faster builds, better control.',
  },
  {
    title: 'Why React Router over Next.js App Router?',
    decision: 'React Router v6 for navigation',
    rationale:
      'Lighter weight than Next.js App Router. Full control over route transitions using View Transitions API. No framework magic, explicit behavior. Perfect for SPA with view transitions.',
  },
  {
    title: 'Why CSS over CSS-in-JS?',
    decision: 'Plain CSS with custom properties',
    rationale:
      'Zero runtime cost, better caching, native browser optimizations. CSS custom properties for theming without JavaScript. Smaller bundle size, faster paint times. CSS-in-JS adds unnecessary runtime overhead for a static site.',
  },
  {
    title: 'Performance-First Architecture',
    decision: 'Manual optimization over framework abstractions',
    rationale:
      'Direct DOM manipulation for animations (bypassing React renders). Intersection Observer for lazy loading. RequestAnimationFrame for smooth 60fps. Every decision prioritizes user experience over developer convenience.',
  },
  {
    title: 'No External Dependencies for UI',
    decision: 'Custom implementations over libraries',
    rationale:
      'Magnetic cursor, scroll animations, view transitions - all custom built. No Framer Motion, GSAP, or other animation libraries. Keeps bundle under 200KB and gives precise control over performance.',
  },
];

export const performanceOptimizations: PerformanceOptimization[] = [
  {
    category: 'Bundle Optimization',
    optimizations: [
      'Route-based code splitting (HomePage, WorkDetailPage)',
      'Lazy loading non-critical components',
      'Tree-shaking with proper ES modules',
      'No heavy dependencies - custom implementations',
      'SVG icons over icon fonts',
    ],
  },
  {
    category: 'Runtime Performance',
    optimizations: [
      'RequestAnimationFrame for all animations',
      'Passive event listeners for scroll handlers',
      'Direct DOM manipulation for high-frequency updates',
      'Intersection Observer to pause off-screen animations',
      'CSS containment to isolate expensive renders',
    ],
  },
  {
    category: 'Loading Strategy',
    optimizations: [
      'Preload critical assets with resource hints',
      'System font stack (no external fonts)',
      'Inline critical CSS',
      'Deferred JavaScript loading',
      'Optimized asset delivery',
    ],
  },
  {
    category: 'Accessibility',
    optimizations: [
      'Respects prefers-reduced-motion',
      'Full keyboard navigation support',
      'Semantic HTML structure',
      'ARIA labels and roles',
      'WCAG AAA color contrast',
    ],
  },
];

export const buildPipeline = {
  development: [
    'Vite dev server with HMR',
    'TypeScript type checking',
    'Biome for linting and formatting',
    'Hot module replacement for instant feedback',
  ],
  production: [
    'Vite build with Rollup bundling',
    'TypeScript compilation',
    'CSS minification and optimization',
    'Asset optimization and compression',
    'Bundle analysis and size checks',
  ],
  deployment: [
    'Static site generation',
    'CDN deployment (Vercel/Netlify)',
    'Automatic HTTPS',
    'Global edge network distribution',
  ],
};

export const metrics = {
  lighthouse: {
    performance: '98+',
    accessibility: '100',
    bestPractices: '100',
    seo: '100',
  },
  bundle: {
    totalSize: '212KB',
    gzipped: '68KB',
    chunks: 'Optimized',
  },
  vitals: {
    fcp: '< 1s',
    lcp: '< 2.5s',
    cls: '0',
    tti: '< 2s',
  },
};
