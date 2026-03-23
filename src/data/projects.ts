interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  overview: string;
  challenges: string[];
  solutions: string[];
  impact: string;
  stack: string[];
  links?: ProjectLink[];
}

export const projects: Project[] = [
  {
    slug: "plasma-pos",
    title: "Plasma",
    subtitle: "Offline-first AI point-of-sale system (Web + Mobile)",
    summary:
      "Independent project: Offline-first POS app with AI-powered inventory management, built with React/React Native, TanStack, Convex real-time backend, and OpenAI integration.",
    overview:
      "Plasma is an experimental offline-first POS application designed for small retailers, combining modern frontend tooling (Vite, TanStack, Convex) with AI-powered features. Built as a cross-platform solution (web + mobile) demonstrating end-to-end ownership from UX to deployment.",
    challenges: [
      "Reliable offline sync without complex backend infrastructure or conflict resolution complexity.",
      "Sub-50ms UI updates for instant feedback during offline operations.",
      "Consistent 60fps performance on low-end Android devices.",
      "Type-safe client-server communication across web and mobile platforms.",
      "AI features (inventory predictions, receipt generation) with streaming responses.",
    ],
    solutions: [
      "Built offline-first architecture with Convex real-time backend and TanStack for optimistic updates, achieving <50ms UI latency.",
      "Implemented sophisticated caching with TanStack, enabling 99.9% sync reliability and seamless online/offline transitions.",
      "Optimized React Native performance for 60fps on low-end Android using FlatList virtualization, React.memo, and intelligent cache invalidation.",
      "Used Convex typed RPC for type-safe client-server communication, eliminating runtime API errors.",
      "Integrated OpenAI API for AI-powered inventory predictions and receipt generation with streaming responses.",
      "Built web app with Vite and deployed on Vercel, mobile app with Expo EAS (OTA updates), sharing 85% of business logic.",
    ],
    impact:
      "Performance: <50ms optimistic updates with offline-first architecture. Sync reliability: 99.9% success rate with Convex real-time backend. UI performance: Consistent 60fps on low-end Android devices. Response time: 40% reduction through TanStack Query caching. Page load: 2.5s improvement via Vite optimization and code-splitting. Code sharing: 85% shared logic between web (Vite) and mobile (Expo). Demonstrates end-to-end frontend ownership, modern tooling expertise, AI integration, and cross-platform architecture.",
    stack: [
      "React",
      "React Native",
      "TypeScript",
      "Vite",
      "Vercel",
      "Expo",
      "TanStack",
      "Convex",
      "OpenAI API",
    ],
  },

  {
    slug: "mms-customize",
    title: "M&Ms – Design Your Own",
    subtitle:
      "Multi-brand composable commerce configurator (MACH architecture)",
    summary:
      "Built React-based product configurator as part of Mars' $100M+ D2C transformation using MACH architecture (Microservices, API-first, Cloud-native, Headless) with Next.js and Amplience CMS.",
    overview:
      "Contributed to Mars Wrigley's composable commerce transformation, building frontend components for the \"Design Your Own M&M's\" personalization platform. The project was part of a multi-brand D2C initiative serving 12 global markets with real-time customization and omnichannel integration (web + in-store printers).",
    challenges: [
      "Legacy monolithic codebase couldn't support real-time rendering and MACH architecture requirements.",
      "Multi-step configurator with logo upload, color selection, and real-time preview needed sub-second response times.",
      "Inconsistent UI patterns across 12 regional teams with different markets and languages.",
      "Image-heavy customization flow required aggressive optimization for mobile performance.",
    ],
    solutions: [
      "Built React components in shared Storybook system integrated with Amplience CMS and headless commerce backend.",
      "Implemented lazy-loading with Intersection Observer and WebP format, reducing image payload by 65% (2.1MB → 750KB).",
      "Optimized GraphQL queries to backend APIs, reducing API calls by 50% through efficient query structure and caching.",
      "Created multi-step wizard UI with form validation, drag-and-drop logo upload (15MB max), and real-time canvas preview.",
      "Collaborated with backend teams on MACH API design to ensure optimal frontend performance and type safety.",
    ],
    impact:
      "Business: 20% YoY revenue increase for Mars D2C proposition. Speed: 60% faster time-to-market for new experiences. Performance: 65% reduction in image payload size (2.1MB → 750KB). API efficiency: 50% fewer API calls through GraphQL optimization. Scale: Serving 500K+ monthly customizations across 12 markets. Architecture: Contributed to world's most comprehensive multi-brand composable commerce implementation.",
    stack: [
      "React",
      "Next.js",
      "TypeScript",
      "Storybook",
      "GraphQL",
      "Amplience",
      "TailwindCSS",
    ],
  },

  {
    slug: "good-eggs",
    title: "Good Eggs",
    subtitle: "Organic grocery delivery platform (Web + Mobile)",
    summary:
      "Built features across web and mobile platforms for one of the Bay Area's largest organic grocery marketplaces, serving 7,000+ products with same-day delivery.",
    overview:
      "Worked on web (React/Next.js) and mobile (React Native) applications for Good Eggs, an organic grocery platform serving the Bay Area and LA markets. Contributed to shopping flows, checkout experience, and recurring delivery features.",
    challenges: [
      "Building consistent features across web and mobile platforms with shared GraphQL backend.",
      "Complex recurring order scheduling with flexible delivery windows and product substitutions.",
      "Managing real-time inventory updates and order modifications across platforms.",
    ],
    solutions: [
      "Built recurring order features allowing customers to schedule automated deliveries with flexible intervals (daily, every 3 days, weekly, bi-weekly, monthly).",
      "Developed cross-platform features for web (React/Next.js) and mobile (React Native) using shared GraphQL API layer.",
      "Optimized GraphQL queries and implemented caching strategies with Apollo Client for better performance.",
      "Worked on shopping and checkout flows, improving user experience across both platforms.",
    ],
    impact:
      "Contributed to platform serving Bay Area and LA markets with 7,000+ products and same-day delivery. Enabled customers to automate grocery orders through flexible recurring delivery scheduling. Platform later acquired by GrubMarket in 2024.",
    stack: [
      "React",
      "React Native",
      "Next.js",
      "GraphQL",
      "TypeScript",
      "Apollo",
      "Jest",
      "Cypress",
    ],
  },

  {
    slug: "rv-energy",
    title: "Red Ventures – Energy Marketplace Platform",
    subtitle:
      "High-traffic energy comparison platforms (SaveOnEnergy, ChooseEnergy, ChooseTexasPower)",
    summary:
      "Built features across multiple energy marketplace platforms including SaveOnEnergy, ChooseEnergy, ChooseTexasPower, TXU, TriEagle, and Energy Harbor, serving millions of monthly users comparing electricity plans.",
    overview:
      "Worked on Red Ventures' energy marketplace platforms—the largest energy comparison sites in the US. Developed Strata, an AI-powered reusable grid component for plan comparison and recommendations. Contributed to EJS to React/Next.js migration and built internal tooling for component development.",
    challenges: [
      "Building a highly reusable plan comparison grid that could be injected across multiple brand websites via script.",
      "Migrating legacy EJS templates to modern React/Next.js architecture across multiple energy brands.",
      "Maintaining consistency across different brand experiences (SaveOnEnergy, ChooseEnergy, TXU, TriEagle, Energy Harbor).",
      "Creating internal tooling for component development and documentation across team.",
    ],
    solutions: [
      "Built Strata, an AI-powered reusable grid component for plan comparison and recommendations, designed for script injection across multiple websites.",
      "Contributed to migration from EJS to React/Next.js architecture across energy brand platforms.",
      "Created internal Demos page (component showcase similar to Storybook) for team documentation and development.",
      "Implemented features using Next.js (most brands) and Vite (Strata), optimizing for performance and developer experience.",
      "Conducted daily code reviews and mentored junior engineers through onboarding process over several months.",
    ],
    impact:
      "Developed Strata as a reusable AI-powered solution for plan comparison across multiple energy brands. Contributed to modernization from EJS to React/Next.js architecture. Built internal tooling (Demos page) improving team development workflow. Serving millions of monthly users across SaveOnEnergy (largest US energy marketplace), ChooseEnergy, and multiple brand sites.",
    stack: [
      "React",
      "Next.js",
      "TypeScript",
      "Vite",
      "Node.js",
      "GraphQL",
      "TailwindCSS",
      "Storybook",
    ],
  },

  {
    slug: "valtech-design-system",
    title: "Valtech Catalyst & LEAP Accelerator",
    subtitle: "Multi-brand commerce component library and design system",
    summary:
      "Built production-ready React component library for Valtech Catalyst design system, later evolved into LEAP—a composable commerce accelerator for multi-brand enterprises.",
    overview:
      "Developed component library and design system infrastructure for Valtech's European commerce practice. The system powered multiple client projects including Mars, reducing site rollout times by 40% through automated brand styling, Storybook-driven development, and CI/CD pipelines.",
    challenges: [
      "Inconsistent design and behavior across client projects slowed development and created maintenance burden.",
      "Each new project required 2+ weeks of setup before feature development.",
      "No automated testing or visual regression testing across components.",
      "Multiple teams needed to contribute without breaking existing patterns.",
    ],
    solutions: [
      "Architected 60+ TypeScript React components with automated brand theming using design tokens and CSS variables.",
      "Built Storybook-driven development workflow with visual regression testing (Chromatic) and automated accessibility audits (axe-core).",
      "Created React + Next.js + Tailwind CSS boilerplate with CI/CD pipeline, reducing project setup from 2 weeks to 3 days (40% reduction).",
      "Established component versioning, release process, and comprehensive documentation for multi-team adoption.",
      "Integrated design system with headless CMS and commerce platforms for client implementations.",
    ],
    impact:
      "Setup time: 2 weeks → 3 days (40% faster project starts). Component library: 60+ production-ready components with full TypeScript. Test coverage: 94% Storybook coverage with automated visual regression. Team scale: Coordinated across 4 agile squads over 18 months. Business impact: Foundation for LEAP accelerator serving multi-brand enterprises. Client rollout: 35% boost in time-to-value by avoiding upgrade cycles.",
    stack: [
      "React",
      "Next.js",
      "TypeScript",
      "Storybook",
      "TailwindCSS",
      "Jest",
    ],
  },
];

export const openSourceProjects: Project[] = [
  {
    slug: "smart-date-input",
    title: "Smart Date Input",
    subtitle: "npm package — natural language date/time input for React",
    summary:
      "Published npm package: an intelligent date/time input that understands natural language like \"tomorrow 7am\" or \"next Friday at 2pm\", with confidence scoring and smart suggestions.",
    overview:
      "Smart Date Input is an open-source React component published on npm that replaces traditional date pickers with a natural language interface. Users type expressions like \"tomorrow 10am\", \"in 3 days\", or \"next friday at 2pm\" and get real-time parsing with confidence indicators, context-aware autocomplete, and keyboard navigation — all fully typed in TypeScript.",
    challenges: [
      "Parsing ambiguous natural language date expressions with varying formats and relative references.",
      "Providing real-time feedback without blocking the UI during continuous input parsing.",
      "Building a confidence scoring system that accurately reflects parse reliability.",
      "Designing an API flexible enough for different use cases while keeping the default experience simple.",
    ],
    solutions: [
      "Built a multi-pattern parser handling relative dates, weekdays, time expressions, durations, and combined inputs with cascading fallback strategies.",
      "Implemented confidence scoring (0–1) based on pattern match specificity — exact matches like \"tomorrow\" score 0.9+, while ambiguous month/date patterns score lower.",
      "Exposed utility functions (parseSmartDateString, generateSmartSuggestions, getDueDateStatus) alongside the component for headless usage.",
      "Designed keyboard-navigable suggestion dropdown with category-based grouping and live date previews.",
    ],
    impact:
      "Published as open-source npm package with full TypeScript definitions. Supports React 16.8+ with zero required configuration. Handles relative dates, specific weekdays, time expressions, durations, and combined natural language inputs. Exports both the component and standalone utility functions for flexible integration.",
    stack: ["React", "TypeScript", "date-fns", "Lucide React"],
    links: [
      { label: "npm", url: "https://www.npmjs.com/package/@gabrielgustavoadnrade/smart-date-input" },
      { label: "GitHub", url: "https://github.com/gabrielgustavoandrade/smart-date-input" },
    ],
  },

  {
    slug: "intentional-youtube",
    title: "Intentional YouTube",
    subtitle: "Chrome extension that removes algorithmic distractions from YouTube",
    summary:
      "Chrome extension (Manifest V3) that transforms YouTube into an intentional-use platform by removing algorithmic recommendations, Shorts, and autoplay.",
    overview:
      "Intentional YouTube is a Chrome extension that strips away YouTube's engagement-driven features — homepage algorithm, Shorts, sidebar recommendations, end-screen suggestions, and autoplay. It redirects the homepage to subscriptions and restructures the watch page to show comments directly below the video instead of behind a wall of recommendations.",
    challenges: [
      "YouTube is a single-page application with aggressive dynamic content injection, making static CSS hiding insufficient.",
      "DOM selectors change frequently with YouTube's deployments, requiring a resilient selector strategy.",
      "Maintaining cleanup state across YouTube's internal navigation without full page reloads.",
      "Balancing strictness levels — some users want minimal cleanup, others want monk-mode isolation.",
    ],
    solutions: [
      "Built a rules engine with MutationObserver (throttled at 200ms) that continuously monitors and cleans newly injected content across page transitions.",
      "Centralized all DOM selectors in a single module with fallback chains, making updates to YouTube's markup a one-file fix.",
      "Implemented a page-type router that detects navigation events and applies page-specific cleanup rules for home, watch, search, channel, and shorts pages.",
      "Created three strictness modes (Balanced, Strict, Monk Mode) with granular per-feature toggles accessible from the extension popup.",
    ],
    impact:
      "Removes Shorts, homepage algorithm, sidebar recommendations, end-screen suggestions, and autoplay UI. Three strictness modes from balanced cleanup to monk-mode isolation. Handles YouTube's SPA navigation and dynamic content injection. Configurable per-feature toggles via extension popup.",
    stack: ["JavaScript", "Chrome Extensions API", "Manifest V3", "CSS"],
    links: [
      { label: "GitHub", url: "https://github.com/gabrielgustavoandrade/intentional-youtube" },
    ],
  },
];

export const allProjects: Project[] = [...projects, ...openSourceProjects];
