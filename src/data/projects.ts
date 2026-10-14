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
  /** One-line descriptor shown under the name. */
  descriptor: string;
  /** Keep the title on one line (e.g. hyphenated package names). */
  nowrapTitle?: boolean;
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
    descriptor: 'Agent platform: React/Next.js and Python',
    highlights: ['Agent observability', 'AI workflows', 'In-product copilot'],
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
    nowrapTitle: true,
    descriptor: 'Date and time input with natural-language parsing',
    summary: 'React and TypeScript component with keyboard navigation.',
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
    descriptor:
      'Frontend for the product configurator used to personalize M&M’s in 12 countries.',
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
