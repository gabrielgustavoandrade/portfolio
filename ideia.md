# Portfolio North Star

This site sells Gabriel Andrade as a senior React/TypeScript engineer who obsesses over speed, clarity, and reliable execution. Every artifact should feel like product documentation: intentional typography, restrained visuals, and measurable engineering receipts.

## Experience Pillars

1. **Performance-first storytelling** — show Lighthouse scores, FPS monitors, and measurable deltas right in the UI (Performance Toggle, metrics callouts inside Work Detail, Build Log posts with charts).
2. **Route-based work exploration** — keep `/work/:slug` detail pages, but wrap every navigation in View Transitions for a polished list → detail experience without inline rendering.
3. **Technical transparency** — “How I Built This” modal, Build Log posts, and console/Easter-egg notes communicate architecture choices and trade-offs like an engineer’s write-up.
4. **Developer trust cues** — fast bundle, stable interactions, no gimmicks. Cursor effects, parallax, or transitions must never compromise 60 fps.

## Interaction Focus

- **View Transitions everywhere**: smooth route changes via `useViewTransition`, subtle fade/scale fallbacks when unsupported.
- **Motion with intent**: staggered work cards, scroll-activated detail sections, minimal parallax in hero/work detail.
- **Accessible micro-interactions**: buttons with explicit types, aria-labels, reduced-motion guards, keyboard-first navigation.

## Content System

- **Hero** → clarity-first statement + primary/secondary CTAs.
- **Selected Work** → curated list with consistent metadata, project detail lives on `/work/:slug`.
- **Build Log** → deep-dives (performance, view transitions, interaction engineering).
- **Tech Stack Modal** → architectural notes, metrics, tooling rationale.
- **Performance Toggle** → real-time metrics to reinforce credibility.
- **About + Contact** → concise narrative + actionable links.

## Future Direction

- **3D/Career Timeline**: paused. Keep exploratory notes off the current spec until we define a clearer visual concept.
- **Optional demos**: Convex/TanStack “live data” proof and a Design-System sandbox remain on the backlog for a post-MVP polish phase.
