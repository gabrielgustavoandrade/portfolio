export interface Post {
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  content: {
    intro: string;
    sections: {
      title: string;
      content: string;
      metrics?: { label: string; value: string; improvement?: string }[];
      code?: { language: string; snippet: string };
      list?: string[];
    }[];
    conclusion: string;
    keyTakeaways: string[];
  };
}

export const posts: Post[] = [
  {
    id: 'lighthouse-98-score',
    title: 'Achieving 98+ Lighthouse Score on This Portfolio',
    description: 'A technical deep dive into the optimization strategies, tooling choices, and performance budget decisions that achieved consistently high Lighthouse scores.',
    date: '2025-01-15',
    readTime: '8 min read',
    tags: ['Performance', 'Vite', 'Optimization'],
    content: {
      intro: 'Building a portfolio is easy. Building one that scores 98+ on Lighthouse across all categories while maintaining rich animations and interactions? That\'s a different challenge. Here\'s how I did it.',
      sections: [
        {
          title: 'The Performance Budget',
          content: 'Before writing any code, I established strict performance budgets that guided every technical decision.',
          metrics: [
            { label: 'Total Bundle Size', value: '< 200KB', improvement: 'gzipped' },
            { label: 'First Contentful Paint', value: '< 1s', improvement: '' },
            { label: 'Time to Interactive', value: '< 2s', improvement: '' },
            { label: 'Cumulative Layout Shift', value: '0', improvement: 'zero layout shifts' },
            { label: 'Animation Frame Rate', value: '60fps', improvement: 'maintained' },
          ],
        },
        {
          title: 'Tooling Decisions',
          content: 'Choosing Vite over Next.js was intentional. For a static portfolio with client-side routing, Vite offers superior developer experience and build performance without the overhead of a full-stack framework.',
          list: [
            'Vite for build tooling - near-instant HMR, optimal code splitting',
            'React Router for client-side navigation - lighter than Next.js App Router',
            'Manual code splitting over framework magic - explicit control',
            'CSS over CSS-in-JS - zero runtime cost, better caching',
          ],
        },
        {
          title: 'Bundle Optimization',
          content: 'Every kilobyte matters. I achieved sub-200KB bundle sizes through aggressive optimization.',
          list: [
            'Manual chunk splitting for routes (HomePage, WorkDetailPage)',
            'Lazy loading non-critical components (PerformanceToggle)',
            'Tree-shaking unused code with proper ES modules',
            'No heavy dependencies - custom implementations over libraries',
            'Intersection Observer API for lazy animations (zero dependencies)',
          ],
        },
        {
          title: 'Image & Asset Strategy',
          content: 'This portfolio is intentionally light on images. When assets are needed, they\'re optimized aggressively.',
          list: [
            'SVG icons over icon fonts - smaller, cacheable, scalable',
            'CSS gradients and effects over images where possible',
            'Preload critical assets with proper resource hints',
            'No third-party fonts - using system font stack',
          ],
        },
        {
          title: 'Runtime Performance',
          content: 'Build size is only half the story. Runtime performance determines the actual user experience.',
          code: {
            language: 'typescript',
            snippet: `// Efficient scroll handling with passive listeners
useEffect(() => {
  const handleScroll = () => {
    const sections = sectionsRef.current?.querySelectorAll('.section');
    sections?.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;
      // Only update when in viewport
      if (scrollPercent > 0 && scrollPercent < 1) {
        section.style.transform = \`translateY(\${(1 - scrollPercent) * 20}px)\`;
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);`,
          },
          list: [
            'RequestAnimationFrame for all animations - no janky setTimeout',
            'Passive event listeners for scroll handlers',
            'CSS containment to isolate expensive renders',
            'Will-change hints for transform animations only',
            'Intersection Observer to pause off-screen animations',
          ],
        },
        {
          title: 'Accessibility & Progressive Enhancement',
          content: 'Performance isn\'t just speed metrics. It\'s also ensuring the site works for everyone.',
          list: [
            'Respects prefers-reduced-motion - disables animations when requested',
            'Full keyboard navigation with visible focus indicators',
            'Semantic HTML for screen readers',
            'No JavaScript required for core content - progressive enhancement',
            'Color contrast ratios exceeding WCAG AAA standards',
          ],
        },
      ],
      conclusion: 'Achieving high Lighthouse scores isn\'t about one silver bullet - it\'s the cumulative result of hundreds of small, intentional decisions. Every dependency, every animation, every byte matters.',
      keyTakeaways: [
        'Establish performance budgets before writing code',
        'Choose tools that match your use case, not the hype',
        'Measure everything - what gets measured gets improved',
        'Accessibility and performance are complementary, not competing',
        'User experience > developer experience, always',
      ],
    },
  },
  {
    id: 'view-transitions-deep-dive',
    title: 'Per-Word View Transitions: Implementation Deep Dive',
    description: 'How I implemented smooth per-word morphing animations using the View Transitions API, solving challenges with React Router and scroll position.',
    date: '2025-01-12',
    readTime: '10 min read',
    tags: ['View Transitions API', 'React', 'Animations'],
    content: {
      intro: 'The View Transitions API is one of the most exciting browser features for creating smooth, app-like experiences. But getting it to work with React Router and maintaining scroll position? That took some work.',
      sections: [
        {
          title: 'The Goal',
          content: 'I wanted to recreate the smooth morphing effect from nmn.sh/blog, where each word in a title transitions independently when navigating between list and detail views.',
        },
        {
          title: 'Understanding View Transitions',
          content: 'The View Transitions API captures a snapshot of the DOM before a change, then animates between the old and new states. The magic happens with CSS view-transition-name properties.',
          code: {
            language: 'css',
            snippet: `/* Each word gets a unique view-transition-name */
.word-1 {
  view-transition-name: project-slug-word-1;
}

/* Browser automatically animates between matching names */
::view-transition-old(project-slug-word-1),
::view-transition-new(project-slug-word-1) {
  animation-duration: 0.6s;
  animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}`,
          },
        },
        {
          title: 'The Per-Word Split',
          content: 'The first challenge was splitting titles into individual words while maintaining a unique view-transition-name for each.',
          code: {
            language: 'typescript',
            snippet: `export function getTitleSegments(slug: string, title: string) {
  const words = title.split(' ');

  return words.map((word, index) => ({
    id: \`\${slug}-word-\${index}\`,
    text: word,
    viewTransitionName: \`\${slug}-word-\${index}\`,
  }));
}

// Usage in component
const titleSegments = getTitleSegments(project.slug, project.title);

return (
  <h2>
    {titleSegments.map((segment, index) => (
      <span
        key={segment.id}
        style={{ viewTransitionName: segment.viewTransitionName }}
      >
        {segment.text}
        {index < titleSegments.length - 1 ? ' ' : ''}
      </span>
    ))}
  </h2>
);`,
          },
        },
        {
          title: 'React Router Integration',
          content: 'The View Transitions API works best with cross-document navigation. Making it work with SPA routing required wrapping React Router navigation.',
          code: {
            language: 'typescript',
            snippet: `const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();

  // Save scroll position before navigating
  if (location.pathname === '/') {
    sessionStorage.setItem(SCROLL_KEY, window.scrollY.toString());
  }

  // Wrap navigation in view transition
  if ('startViewTransition' in document) {
    (document as any).startViewTransition(() => {
      navigate(to);
    });
  } else {
    navigate(to);
  }
};`,
          },
        },
        {
          title: 'Scroll Restoration Challenge',
          content: 'The hardest part was restoring scroll position after the transition. The solution required executing the scroll synchronously within the transition callback.',
          code: {
            language: 'typescript',
            snippet: `const handleClose = () => {
  if ('startViewTransition' in document) {
    (document as any).startViewTransition(() => {
      navigate('/');

      // Restore scroll IMMEDIATELY after navigation
      const savedScroll = sessionStorage.getItem(SCROLL_KEY);
      if (savedScroll) {
        window.scrollTo(0, parseInt(savedScroll, 10));
      }
    });
  }
};`,
          },
          list: [
            'Attempted async restoration - failed, page jumped',
            'Tried setTimeout delays - created visual flicker',
            'Solution: Synchronous scroll in transition callback',
          ],
        },
        {
          title: 'Performance Considerations',
          content: 'View transitions can be expensive. I optimized by limiting the number of transitioning elements and using efficient selectors.',
          list: [
            'Only title words transition - not entire cards',
            'Reduced motion check to disable for accessibility',
            'CSS containment on transitioning elements',
            'Kept transition duration under 600ms for snappiness',
          ],
        },
      ],
      conclusion: 'The View Transitions API is powerful but requires careful integration with modern frameworks. The result is worth it - smooth, native-feeling animations without heavy JavaScript libraries.',
      keyTakeaways: [
        'View Transitions API works best when view-transition-names match exactly',
        'React Router requires manual wrapping of navigation',
        'Scroll restoration must happen synchronously in transition callback',
        'Always provide fallback for browsers without support',
        'Respect prefers-reduced-motion for accessibility',
      ],
    },
  },
  {
    id: 'magnetic-cursor-performance',
    title: 'Magnetic Cursor Effects Without Performance Jank',
    description: 'Building smooth, 60fps magnetic cursor interactions using requestAnimationFrame and proper event handling optimization.',
    date: '2025-01-08',
    readTime: '6 min read',
    tags: ['Performance', 'Animations', 'UX'],
    content: {
      intro: 'Magnetic cursor effects are visually striking, but poorly implemented ones tank performance. Here\'s how to build them properly at 60fps.',
      sections: [
        {
          title: 'The Problem',
          content: 'Naive implementations attach mousemove listeners that trigger re-renders on every pixel movement. At 60fps, that\'s 60 React renders per second.',
        },
        {
          title: 'The Solution: Direct DOM Manipulation',
          content: 'For performance-critical animations, bypass React\'s render cycle entirely and manipulate the DOM directly.',
          code: {
            language: 'typescript',
            snippet: `const handleMouseMove = (e: MouseEvent, card: Element) => {
  const titleWords = card.querySelectorAll('.work-card__title span');

  titleWords.forEach((word) => {
    const rect = word.getBoundingClientRect();
    const wordCenterX = rect.left + rect.width / 2;
    const wordCenterY = rect.top + rect.height / 2;

    const deltaX = e.clientX - wordCenterX;
    const deltaY = e.clientY - wordCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < 100) {
      const strength = (1 - distance / 100) * 0.15;
      const moveX = deltaX * strength;
      const moveY = deltaY * strength;

      // Direct DOM manipulation - zero React renders
      (word as HTMLElement).style.transform =
        \`translate(\${moveX}px, \${moveY}px)\`;
    }
  });
};`,
          },
        },
        {
          title: 'Event Handler Optimization',
          content: 'Reducing the frequency of expensive calculations with proper event management.',
          list: [
            'Attach listeners only to parent cards, not individual words',
            'Use getBoundingClientRect once per word, not per frame',
            'Implement distance threshold to skip far-away words',
            'Reset transforms on mouseleave for cleanup',
          ],
        },
        {
          title: 'CSS Optimization',
          content: 'CSS plays a crucial role in smooth magnetic effects.',
          code: {
            language: 'css',
            snippet: `.work-card__title span {
  display: inline-block;
  transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
  will-change: transform; /* Hint to browser for GPU optimization */
}`,
          },
          list: [
            'will-change: transform - promotes to GPU layer',
            'Short transition duration (0.2s) for responsive feel',
            'Smooth easing function, not janky linear',
          ],
        },
        {
          title: 'Accessibility Consideration',
          content: 'Always check for reduced motion preference to respect user settings.',
          code: {
            language: 'typescript',
            snippet: `useEffect(() => {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) return; // Skip magnetic effect

  // Setup listeners...
}, []);`,
          },
        },
        {
          title: 'Performance Metrics',
          content: 'Measuring the impact of optimizations.',
          metrics: [
            { label: 'Frame Rate', value: '60fps', improvement: 'maintained' },
            { label: 'React Renders', value: '0', improvement: 'per mousemove' },
            { label: 'CPU Usage', value: '< 5%', improvement: 'on hover' },
            { label: 'Memory Allocation', value: '0', improvement: 'no object creation' },
          ],
        },
      ],
      conclusion: 'Magnetic cursor effects don\'t have to be performance killers. With direct DOM manipulation, proper event handling, and CSS optimization, you can create smooth 60fps interactions.',
      keyTakeaways: [
        'Direct DOM manipulation for high-frequency animations',
        'Event delegation over individual listeners',
        'will-change CSS property for GPU optimization',
        'Always respect prefers-reduced-motion',
        'Measure performance with real profiling, not guesses',
      ],
    },
  },
];
