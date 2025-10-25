# Portfolio Spec — Gabriel Andrade

## 1. Overview
- **Stack:** Vite + React 18 + TypeScript + React Router v6
- **Routing:** `/` (home) + `/work/:slug` (detail) with SPA navigation
- **Deployment:** Vercel (SPA fallback enabled)
- **Tone:** calm, precise, product-doc style; minimal color, typography-driven
- **Goal:** demonstrate senior-level frontend craft via performance receipts, technical write-ups, and polished transitions

## 2. Architecture & Navigation
| Element | Decision |
| --- | --- |
| Bundler | Vite (fast local dev, small output) |
| Routing | React Router w/ future flags (`v7_startTransition`, `v7_relativeSplatPath`) |
| Transition layer | `useViewTransition` hook wraps `document.startViewTransition`, falls back to synchronous execution |
| State | Local component state + static data modules |
| Styling | CSS modules per component + shared tokens (`src/styles/tokens.css`) |

### View Transition Hook
```ts
type TransitionOptions = { onBeforeTransition?: () => void };
type TransitionHandler = (options?: TransitionOptions) => Promise<void> | void;

export function useViewTransition(): (
  callback: TransitionHandler,
  options?: TransitionOptions,
) => ViewTransition | void;
```
- Detects support, calls `document.startViewTransition` when available, otherwise runs callback immediately.
- Consumers (`TransitionLink`, `WorkDetailPage`, future animation triggers) call `startTransition(() => navigate(...))`.
- Docs should remind contributors to keep synchronous scroll restoration inside the callback for supported browsers and use `requestAnimationFrame` fallbacks elsewhere.

## 3. Data Model
```ts
export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  meta: { role: string; location: string };
  summary: string;
  overview: string;
  challenges: string[];
  solutions: string[];
  impact: string;
  stack: string[];
}
```
- Years removed from `meta`—timeline details belong in narrative copy, not the structured object.
- Supporting datasets: `posts` (Build Log entries), `techStack` (modal content), `metrics` (Performance Toggle).

## 4. Page Structure
1. **Hero** — headline, subhead, tagline, dual CTAs, subtle scroll cue.
2. **Selected Work** — list of projects; each card links to `/work/:slug`. Keep magnetic/micro interactions but ensure 60 fps and reduced-motion guards.
3. **Work Detail Page** — hero block (title, subtitle, meta), overview, challenges, solutions, impact, stack badges, closing CTA/back button.
4. **Build Log** — accordion list of technical posts; each entry expands inline with metrics, prose, and takeaways.
5. **About** — concise story (location, focus areas).
6. **Contact** — CTA button (`mailto:`) + LinkedIn link.
7. **Footer** — copyright copy, Tech Stack Modal trigger, Performance Toggle trigger.
8. **Global Easter eggs** — console log summary, stored metrics, etc.

## 5. Transitions & Motion Guidelines
- Wrap all SPA navigations in `useViewTransition`.
- When View Transitions unsupported, apply CSS-based fade/scale classes for continuity.
- Preserve scroll position between home and detail using `sessionStorage` (`portfolio:scroll-position`), restoring immediately during transitions and via `requestAnimationFrame` on fallback paths.
- Respect `prefers-reduced-motion` before running magnetic cursor or parallax effects.

## 6. Performance & Accessibility Targets
- Lighthouse ≥ 95 (Performance & A11y)
- Bundle (gzipped) ≤ 80 KB for base route
- FCP < 1.2 s, TTI < 2.5 s on mid-tier hardware
- 60 fps animations; throttle heavy observers when unfocused
- Buttons use `type="button"`, aria labels on interactive SVGs, focus outlines visible, min touch target 44×44 px

## 7. Content Elements
- **Performance Toggle** — slide-in panel with FPS, Core Web Vitals, memory usage, etc.
- **Tech Stack Modal** — metrics, architectural decisions, build/deploy notes.
- **Build Log posts** — at least two detailed articles (“98+ Lighthouse”, “Per-Word View Transitions”), each referencing exact metrics/tools.

## 8. Optional Enhancements (Phase 4)
1. **Convex/TanStack Demo** — real-time mini-app showing optimistic updates and typed APIs. Useful for full-stack storytelling; gated behind lazy route.
2. **Design-System Sandbox** — interactive component playground highlighting tokens, accessibility, and composability. Ideal when targeting design system roles.
3. **Other visual experiments** — any future 3D timeline or data canvas can be reconsidered later; keep them out of current scope until a concrete concept emerges.
