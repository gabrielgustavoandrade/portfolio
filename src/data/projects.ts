export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  meta: { role: string; years: string; location: string };
  summary: string;
  overview: string;
  challenges: string[];
  solutions: string[];
  impact: string;
  stack: string[];
}

export const projects: Project[] = [
  {
    slug: "mms-customize",
    title: "M&Ms – Design Your Own",
    subtitle: "Personalized e-commerce product configurator",
    meta: {
      role: "Frontend Engineer",
      location: "Remote — London, UK",
    },
    summary:
      "Worked on the React-based product configurator that lets users personalize M&Ms packaging across regions.",
    overview:
      "At Valtech, I contributed to the frontend development of the 'Design Your Own M&Ms' platform for Mars. The project brought real-time customization to a global commerce environment and required close collaboration across multiple teams and markets.",
    challenges: [
      "Legacy codebase struggled with real-time rendering and performance.",
      "Each regional team maintained its own inconsistent UI stack.",
      "Strict marketing deadlines and multilingual requirements.",
    ],
    solutions: [
      "Implemented new React components within a shared Storybook system used by several squads.",
      "Optimized image loading and state management for smoother customization previews.",
      "Collaborated with backend and design teams to ensure integration within a MACH-based architecture.",
    ],
    impact:
      "Improved stability, consistency, and performance across global M&Ms personalization sites.",
    stack: ["React", "TypeScript", "Storybook", "GraphQL", "TailwindCSS"],
  },

  {
    slug: "valtech-design-system",
    title: "Valtech Design System",
    subtitle: "Reusable component library for multi-brand commerce",
    meta: {
      role: "Frontend Engineer",
      location: "Remote — London, UK",
    },
    summary:
      "Built and maintained a React component library and documentation hub used across multiple client projects.",
    overview:
      "Created a consistent UI foundation for Valtech’s European commerce teams. The library standardized accessibility, responsiveness, and visual consistency across different brands and platforms.",
    challenges: [
      "Design and behavior inconsistencies across client projects.",
      "Slow onboarding for new developers due to scattered patterns.",
      "Need for accessible, tested components that scale.",
    ],
    solutions: [
      "Developed over 60 components using React, TypeScript, TailwindCSS, and Storybook.",
      "Automated visual regression testing and versioned component releases.",
      "Wrote documentation and usage guidelines for internal adoption.",
    ],
    impact:
      "Enabled faster project starts and improved design consistency across brands.",
    stack: ["React", "TypeScript", "Storybook", "TailwindCSS", "Jest"],
  },

  {
    slug: "rv-energy",
    title: "Red Ventures – Energy Platform",
    subtitle: "High-traffic energy comparison and signup products",
    meta: {
      role: "Senior Software Engineer (via BairesDev)",
      location: "Remote — California, US",
    },
    summary:
      "Built and optimized React-based acquisition flows for multiple Red Ventures energy brands, including TXU, TriEagle, and Energy Harbor.",
    overview:
      "Part of the Energy Team at BairesDev, working on customer acquisition sites for major U.S. utility providers. Focused on performance, maintainability, and a consistent codebase shared across brands.",
    challenges: [
      "Legacy React codebases with inconsistent state management and routing.",
      "Slow page performance and poor SEO metrics.",
      "Releasing updates across multiple brands from a shared infrastructure.",
    ],
    solutions: [
      "Migrated key projects to Next.js for server-side rendering and better SEO.",
      "Refactored shared components and utilities to reduce bundle duplication.",
      "Integrated analytics and A/B testing to guide UX improvements.",
    ],
    impact:
      "Improved load times and Lighthouse scores across brands, supporting millions of monthly visits.",
    stack: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "AWS",
      "GraphQL",
      "Styled-Components",
    ],
  },

  {
    slug: "good-eggs",
    title: "Good Eggs",
    subtitle: "Marketplace performance and accessibility improvements",
    meta: {
      role: "Frontend Engineer (Contract)",
      location: "Remote — San Francisco, US",
    },
    summary:
      "Contributed to frontend modernization during the Next.js migration, improving checkout speed and accessibility.",
    overview:
      "Worked with a distributed team optimizing the Good Eggs shopping and checkout experience. Focused on bundle performance, accessibility, and GraphQL query optimization.",
    challenges: [
      "Large bundle size and slow initial load times.",
      "Accessibility gaps across interactive elements.",
      "Outdated data fetching patterns causing redundant re-renders.",
    ],
    solutions: [
      "Reduced bundle size by 28% through dependency pruning and lazy loading.",
      "Added continuous accessibility testing with axe-core and Lighthouse.",
      "Refactored product queries and cache layers for predictable state.",
    ],
    impact:
      "Improved checkout experience and achieved full AA accessibility compliance.",
    stack: [
      "React",
      "Next.js",
      "GraphQL",
      "TypeScript",
      "Apollo",
      "Jest",
      "Cypress",
    ],
  },

  {
    slug: "plasma-pos",
    title: "Plasma",
    subtitle: "Offline-first AI point-of-sale system",
    meta: {
      role: "Founder / Full-stack Engineer",
      location: "Madrid, Spain",
    },
    summary:
      "Independent project exploring AI-driven inventory and offline sync for small retailers.",
    overview:
      "Plasma is an experimental POS app designed to run smoothly online and offline, using a fully typed stack from front to back. It blends AI assistants, real-time updates, and clean UX for small business operations.",
    challenges: [
      "Reliable offline sync without complex backend infrastructure.",
      "Real-time UX for local and remote updates.",
      "Keeping strong typing across frontend, backend, and APIs.",
    ],
    solutions: [
      "Used Convex typed RPC for live sync and optimistic state handling.",
      "Built AI helpers for smart restocking and receipt generation.",
      "Deployed through Expo EAS for fast OTA updates and continuous delivery.",
    ],
    impact:
      "Demonstrates end-to-end ownership, from concept and UX to data architecture and AI integration.",
    stack: [
      "React Native",
      "Expo",
      "Convex",
      "TanStack Query",
      "TypeScript",
      "OpenAI API",
    ],
  },
];
