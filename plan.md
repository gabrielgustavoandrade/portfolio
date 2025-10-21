# ⚙️ **Spec Kit Prompt — Gabriel Andrade Portfolio**

**Stack:** Vite + React + React Router + TypeScript + native View Transitions
**Goal:** Build a fast, minimal, text-driven portfolio SPA showcasing product stories with inline transitions.

---

## 👤 About Gabriel

Brazilian software engineer based in Madrid.
6 + years building consumer and commerce products across Valtech, BairesDev, and independent projects.
Focus on clarity, performance, and scalable design systems.

---

## 🧠 Tone & Personality

Calm · Precise · Design-oriented · Minimalist.
No buzzwords — sound like thoughtful product documentation.
Example voice: “I focus on clarity, performance, and interfaces that feel effortless.”

---

## 🧱 Architecture

| Element         | Decision                                     |
| --------------- | -------------------------------------------- |
| Framework       | React 18 +                                   |
| Bundler         | Vite                                         |
| Router          | React Router v6 +                            |
| Routing pattern | `/work/:slug`                                |
| Routing type    | Client-side SPA routes with inline expansion |
| Deployment      | Vercel (SPA fallback enabled)                |

---

## 🗂 Data Model

```ts
export interface Project {
  slug: string
  title: string
  subtitle: string
  meta: { role: string; years: string; location: string }
  summary: string
  overview: string
  challenges: string[]
  solutions: string[]
  impact: string
  stack: string[]
}
```

---

## 📱 Responsive Breakpoints

```
Mobile: < 640 px
Desktop: ≥ 640 px
```

---

## 🎨 Design System Tokens

| Token               | Value                            |
| ------------------- | -------------------------------- |
| Background          | #0b0c10                          |
| Text (primary)      | #e8e8e8                          |
| Text (muted)        | #a1a1aa                          |
| Border              | rgba(255,255,255,0.12)           |
| Card bg             | rgba(255,255,255,0.05)           |
| Radius              | 16 px                            |
| Spacing scale       | 8 · 12 · 16 · 24 · 40 · 80 · 120 |
| Transition duration | 180–220 ms                       |
| Easing              | cubic-bezier(0.25, 0.1, 0.25, 1) |
| Font                | Inter / system-ui / sans-serif   |
| Accent              | none (monochrome only)           |
| Focus outline       | 1 px solid rgba(255,255,255,0.4) |

No images or icons — typography and spacing define the aesthetic.

---

## 📐 Layout & Sections

Single-column (max-width 720 px) vertical flow:

1. **Hero**
2. **Selected Work**
3. **About Me**
4. **Contact**
5. **Footer**

---

### 1️⃣ Hero

* Heading “Gabriel Andrade” (48 px desktop / 34 px mobile)
* Subhead “Frontend / Full-stack Engineer crafting fast, aesthetic, reliable interfaces.”
* Optional line “I build software that feels invisible.”
* Primary CTA “See my work” (solid light) · Secondary CTA “Contact” (ghost)
* 120 px top/bottom padding, solid black background.
* Optional scroll cue (chevron fade-in after 2 s).

---

### 2️⃣ Selected Work (list state)

* Section title “Selected Work” + subtitle “Products and systems I helped design and build.”
* Vertical stack of cards (24 px gap).
* Card content: title `view-transition-name="work-title-[slug]"`, subtitle, meta (role · years · location), summary.
* Hover: bg lighten (0.05→0.08) + scale 1.01 ease 200 ms.
* Click → inline transition to detail view.

---

### 3️⃣ Inline Project Detail (expanded state)

Appears inline in place of the list — not a drawer or page reload.

**Motion sequence**

1. Fade + blur list (150 ms ease-out)
2. Morph title (native View Transition)
3. Fade + translate detail (200 ms ease-in-out)
4. Reverse on Back

Scroll project into view on open; restore position on close.

**Detail layout**

* Title (morph target)
* Subtitle/meta (role · years · location)
* Overview (2–3 sentences)
* Key challenges (3 bullets)
* Solutions (3 bullets)
* Impact (1 italic line)
* Stack (inline muted text)
* Back link “← Back to Work”

---

### 4️⃣ About Me

Heading “About Me” · 3–4 sentences first-person:

> “I’m a Brazilian software engineer based in Madrid.
> Over six years I’ve worked on consumer and commerce products — blending UX thinking with strong engineering foundations.
> I focus on speed, clarity, and design systems that scale.”
> Optional subline: “Currently exploring new projects across Europe.”

---

### 5️⃣ Contact

Heading “Let’s work together.”
Paragraph “Available for remote and hybrid roles across Europe.”
Primary CTA `mailto:your.email@example.com` (Email me).
Secondary text link → LinkedIn.
Padding 120 px top / 80 px bottom.

---

### 6️⃣ Footer

`© Gabriel Andrade 2025` — 12 px muted gray, centered or left-aligned.

---

## 🪄 Interaction Model — Inline View Transitions

* Use `document.startViewTransition()` for Chrome / Edge 111 + .
* Fallback = opacity-only fade (Safari / Firefox).
* Each project title shares `view-transition-name`.
* Scroll project into view on open and restore on close.
* Keyboard: Enter/Space open · ESC/Backspace close.
* Focus: trap within detail, restore on exit.
* Cursor: pointer on cards.
* Touch target: ≥ 44 × 44 px.
* ARIA: `aria-label="View [Project Name] details"` on cards.
* Screen-reader announcement: “Opened [Project Name] details.”
* Respect `prefers-reduced-motion`.

---

## 🔧 Hook — `useViewTransition`

File: `/src/hooks/useViewTransition.ts`

Creates a utility hook that:

* Checks `document.startViewTransition` support.
* Returns a wrapper function to run state updates within a transition if available.
* Falls back to immediate update when unsupported.

Usage example signature:

```ts
const start = useViewTransition()
start(() => setState(...))
```

---

## 🌍 Browser Compatibility

```
View Transitions API: Chrome / Edge 111 +
Fallback: opacity-only for Safari / Firefox
```

---

## 🚀 Performance Targets

```
FCP < 1.2 s
TTI < 2.5 s
Lighthouse ≥ 95 (Performance & Accessibility)
Bundle < 100 KB
```

Use lazy hydration and code-splitting to stay under target.

---

## ♿ Accessibility Checklist

* ARIA labels on cards.
* Focus trap in detail view.
* Screen reader announcements on state changes.
* Min touch target 44 × 44 px.
* AA contrast or better.
* `prefers-reduced-motion` respected.

---

## 🧾 Project Examples

### 1️⃣ M&Ms — Customize Your Own

```json
{
  "slug": "mms-customize",
  "title": "M&Ms — Customize Your Own",
  "subtitle": "E-commerce personalization experience",
  "meta": { "role": "Senior Frontend Engineer", "years": "2021–2024", "location": "Remote — London, UK" },
  "summary": "A React-based configurator that lets users design custom M&Ms packaging and merch.",
  "overview": "At Valtech I led the frontend architecture for the 'Design Your Own M&Ms' product — a personalization flow integrated into Mars Commerce Cloud.",
  "challenges": [
    "Legacy platform couldn’t handle real-time customization.",
    "Multiple regional teams needed a shared UI system.",
    "Strict marketing deadlines for holiday releases."
  ],
  "solutions": [
    "Built typed component library in React + Storybook used across 4 squads.",
    "Optimized bundle via route code-splitting and image pipeline.",
    "Adopted MACH architecture for parallel delivery and scalability."
  ],
  "impact": "32 % faster load times and 40 % quicker feature rollout across regions.",
  "stack": ["React","TypeScript","Storybook","GraphQL","TailwindCSS"]
}
```

### 2️⃣ Plasma POS

```json
{
  "slug": "plasma-pos",
  "title": "Plasma POS",
  "subtitle": "Offline-first AI point-of-sale app",
  "meta": { "role": "Founder / Full-stack Engineer", "years": "2025 – Present", "location": "Madrid, Spain" },
  "summary": "A modern POS system with offline sync and AI-powered inventory suggestions.",
  "overview": "I founded Plasma to experiment with typed APIs and AI assistants for small business tools. It combines a React Native frontend with a Convex backend for real-time data.",
  "challenges": [
    "Reliable offline sales sync without complex infrastructure.",
    "Delightful mobile UX with zero friction.",
    "Keep stack simple yet type-safe end-to-end."
  ],
  "solutions": [
    "Implemented Convex typed RPC for state synchronization.",
    "Built AI helpers to generate receipts and restock orders.",
    "Used React Native + Expo for fast iteration and EAS deployments."
  ],
  "impact": "Demonstrates product sense and engineering ownership beyond client work.",
  "stack": ["React Native","Expo","Convex","TanStack Query","TypeScript"]
}
```

---

## 📧 Contact Details

Primary email: **[your.email@example.com](mailto:your.email@example.com)**
LinkedIn: **linkedin.com/in/yourprofile**
CTA button uses `mailto:your.email@example.com` link.

---

## 📁 Component / File Structure

```
/src
  /components
    Hero.tsx
    WorkList.tsx
    WorkDetail.tsx
    About.tsx
    Contact.tsx
    Footer.tsx
  /data
    projects.ts
  /hooks
    useViewTransition.ts
  /styles
    tokens.css
  App.tsx
  main.tsx
```

---

## ✅ Deliverables

1. Functional SPA (Vite + React Router + TypeScript).
2. Inline View Transition behavior identical to nmn.sh/blog.
3. Components: Hero, WorkList, WorkDetailInline, About, Contact, Footer.
4. Typed project data with seed examples.
5. Responsive breakpoints and accessible focus patterns.
6. Performance & Accessibility ≥ 95 Lighthouse.
7. Deployable on Vercel with SPA fallback.
