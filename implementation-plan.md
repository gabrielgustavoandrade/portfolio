# Implementation Plan

## Phase 1 – Foundations ✅
- SPA scaffold (Vite + React + Router) with `/` + `/work/:slug`
- Hero, Selected Work, Work Detail, About, Contact, Footer components
- Static datasets for projects/posts/tech stack
- View Transition future flags enabled in `BrowserRouter`
- Performance Toggle, Tech Stack Modal, Build Log, console easter egg
- Bundle, linting, formatting tooling (Bun, Biome)

## Phase 2 – Transitions & UX Polish (Current)
1. **`useViewTransition` hook**  
   - Implement the proposed API and update `TransitionLink` + `WorkDetailPage` to consume it.  
   - Document usage patterns (scroll restoration, fallbacks).

2. **Route-based detail refinements**  
   - Keep `/work/:slug`, but add consistent fade/scale classes on card → detail navigation (fallback path).  
   - Ensure sessionStorage scroll persistence stays in sync with the hook.

3. **Data consistency**  
   - Enforce `meta: { role; location }` across TypeScript interfaces, datasets, and UI.  
   - Update docs to reflect the simplified schema.

4. **Motion accessibility audit**  
   - Recheck `prefers-reduced-motion` guards for magnetic titles, parallax, and hero scroll cue.  
   - Confirm focus handling (detail back button, modal toggles).

5. **Storytelling polish**  
   - Refresh Build Log copy and metrics so each post references current tooling/perf numbers.  
   - Keep Tech Stack Modal aligned with real build pipeline (Biome, Bun, Vercel).

## Phase 3 – Narrative Depth
1. **Additional Build Log entries** — e.g., “Performance Toggle internals”, “Session-aware scroll restoration”.  
2. **Case-study assets** — optional diagrams or metric cards inside Work Detail to surface measurable outcomes.  
3. **Recruiter-friendly snippets** — condensed summaries per project (role, location, impact) for quick scanning.

## Phase 4 – Optional Enhancements
1. **Convex/TanStack Live Demo**  
   - Mini optimistic-update app demonstrating real-time collaboration, typed RPC, and DX story.  
   - Load lazily and gate behind explicit CTA to avoid impacting core bundle.

2. **Design-System Sandbox**  
   - Component playground showing tokens, accessibility toggles, and code snippets.  
   - Ideal when targeting design-system roles or as supplemental blog content.

3. **Visual experiments (TBD)**  
   - 3D timeline / WebGL scenes on hold until a clearer direction emerges.  
   - Document new concept separately once performance budget and UX value are defined.

## Success Criteria
- All navigations run through `useViewTransition` with graceful fallbacks.
- Bundle remains ≤ 80 KB gzipped; Lighthouse ≥ 95 after new polish. 
- Animations respect reduced-motion preferences without breaking narratives.
- Optional demos stay quarantined behind lazy routes so they never penalize the core experience.
