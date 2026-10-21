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
  width: number;
  height: number;
  /** `cover` crops into the frame; `contain` letterboxes on a light mat. */
  fit: 'cover' | 'contain';
  position?: string;
  mobilePosition?: string;
}

/** Tag, descriptor, summary, highlights and alt text live in i18n/messages. */
export interface Project {
  slug: string;
  index: string;
  name: string;
  /** Keep the title on one line (e.g. hyphenated package names). */
  nowrapTitle?: boolean;
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
    name: 'InteractiveAI',
    image: {
      src: '/images/work/interactiveai-desktop',
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
    name: 'smart-date-input',
    nowrapTitle: true,
    links: [
      { label: 'npm', url: SMART_DATE_INPUT_LINKS.npm },
      { label: 'GitHub', url: SMART_DATE_INPUT_LINKS.github },
    ],
    image: {
      src: '/images/work/sdi-render-readable',
      width: 1488,
      height: 368,
      fit: 'contain',
    },
  },
  {
    slug: 'mms-design-your-own',
    index: '03',
    name: 'M&M’s Design Your Own',
    image: {
      src: '/images/work/m-ms-desktop',
      width: 2880,
      height: 1800,
      fit: 'cover',
      position: '40% 45%',
      mobilePosition: '50% 6%',
    },
  },
];
