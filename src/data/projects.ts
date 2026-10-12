export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectMetric {
  value: string;
  label: string;
}

export interface ProjectImage {
  /** Path without extension; a .webp and a .png live side by side in public/. */
  src: string;
  alt: string;
  width: number;
  height: number;
  /** `cover` crops into the frame; `contain` letterboxes on a light mat. */
  fit: 'cover' | 'contain';
  position?: string;
  mobilePosition?: string;
}

export interface Project {
  slug: string;
  index: string;
  tag: string;
  name: string;
  headline: string;
  summary?: string;
  highlights?: string[];
  metrics?: ProjectMetric[];
  links?: ProjectLink[];
  image: ProjectImage;
  lead?: boolean;
}

export const SMART_DATE_INPUT_LINKS = {
  npm: 'https://www.npmjs.com/package/@gabrielgustavoandrade/smart-date-input',
  github: 'https://github.com/gabrielgustavoandrade/smart-date-input',
  packageName: '@gabrielgustavoandrade/smart-date-input',
} as const;

export const projects: Project[] = [
  {
    slug: 'interactive-ai',
    index: '01',
    tag: 'Current',
    name: 'InteractiveAI',
    headline: 'AI agents in production',
    summary:
      'React/Next.js app and Python FastAPI services for running agents in production.',
    highlights: [
      'Agent observability',
      'Agentic workflows',
      'In-product copilot',
    ],
    image: {
      src: '/work/interactiveai-desktop',
      alt: 'InteractiveAI platform, public site',
      width: 2880,
      height: 1800,
      fit: 'cover',
      position: '50% 80%',
      mobilePosition: '50% 20%',
    },
    lead: true,
  },
  {
    slug: 'smart-date-input',
    index: '02',
    tag: 'Open source',
    name: 'smart-date-input',
    headline: 'Natural-language date input, on npm',
    summary: 'React/TypeScript, keyboard navigation.',
    links: [
      { label: 'npm', url: SMART_DATE_INPUT_LINKS.npm },
      { label: 'GitHub', url: SMART_DATE_INPUT_LINKS.github },
    ],
    image: {
      src: '/work/sdi-render-readable',
      alt: 'smart-date-input parsing “next friday at 2pm” to Oct 16 at 14:00',
      width: 1488,
      height: 368,
      fit: 'contain',
    },
  },
  {
    slug: 'mms-design-your-own',
    index: '03',
    tag: 'via Valtech',
    name: 'M&M’s Design Your Own',
    headline: '500K+ customizations / month',
    metrics: [
      { value: '−65%', label: 'image payload' },
      { value: '−50%', label: 'API calls' },
      { value: '12', label: 'countries' },
    ],
    image: {
      src: '/work/m-ms-desktop',
      alt: 'M&M’s Design Your Own color step',
      width: 2880,
      height: 1800,
      fit: 'cover',
      position: '40% 45%',
      mobilePosition: '50% 6%',
    },
  },
];
