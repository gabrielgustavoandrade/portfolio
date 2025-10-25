# Repository Guidelines

This Vite + React + TypeScript portfolio is optimized for Bun-based dev workflows and deploys via Vercel. Follow the practices below to keep changes consistent and easy to review.

## Project Structure & Module Organization
Source lives in `src/` with entry points in `main.tsx` and `App.tsx`. Split UI into `components/`, route shells inside `routes/`, reusable hooks under `hooks/`, and curated content in `data/`. Styling is centralized in `styles/` plus component-level CSS as needed, while shared helpers and typings reside in `utils/` and `types/`. Static assets (favicons, fonts) should be dropped into `public/`. The production build emits to `dist/`; never edit that directory manually.

## Build, Test, and Development Commands
- `bun install` — install dependencies in sync with `bun.lock`.
- `bun run dev` — start the Vite dev server with hot reloading.
- `bun run build` — run `tsc` type checks, then emit an optimized Vite bundle to `dist/`.
- `bun run preview` — serve the latest build exactly as Vercel will.
- `bun run lint`, `bun run format`, `bun run check` — run Biome in lint-only, format-in-place, or combined check mode before committing.

## Coding Style & Naming Conventions
Biome (`biome.json`) enforces two-space indentation, single quotes, trailing commas, and required semicolons. Keep React components as PascalCase functions and export them from files that mirror the component name (e.g., `HeroSection.tsx`). Hooks belong in `hooks/` and must start with `use`. Favor typed data objects in `src/data` and keep route params typed via helpers in `types/`. Prefer CSS logical properties and semantic class names grouped by feature (e.g., `.work-card`, `.work-card__title`), and colocate component-specific styles near the component if they aren’t shared.

## Testing Guidelines
Automated tests are not yet wired up; rely on `bun run preview` for manual verification. When adding tests, use Vitest + React Testing Library, colocate `*.test.tsx` files next to the code they cover, and target critical page routes (`HomePage`, `WorkDetailPage`). Aim for meaningful assertions rather than exhaustive snapshots, and document any required environment variables inside the test file header comments.

## Commit & Pull Request Guidelines
Existing history follows short imperative subjects (e.g., “Add developer-focused features and tech stack modal”). Keep messages under ~72 characters with optional scope tags (`feat:`, `fix:`) if it aids clarity, and elaborate in the body when multiple concerns are touched. For pull requests, include: 1) a concise summary, 2) linked issue or Notion task, 3) screenshots or recordings for UI changes (desktop + mobile), and 4) verification details (`bun run build`, `bun run lint`). Request review only after CI (or the manual checklist) is green.

## Security & Deployment Tips
Environment variables for analytics or API keys must be defined via the Vercel dashboard and exposed through `import.meta.env`. Never commit `.env` files. Before merging, run `bun run build && bun run preview` to match the production deployment pipeline defined in `vercel.json`.
