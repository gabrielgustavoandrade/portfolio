export interface Experience {
  company: string;
  clients?: string;
  engagement: string;
  /**
   * Only dates with a written source (old site content, git history,
   * brief). Leave undefined rather than estimate.
   */
  period?: string;
  points: string[];
}

export const experience: Experience[] = [
  {
    company: 'InteractiveAI',
    engagement: 'Contract',
    // Source: src/data/projects.ts at 2881290 ("Mar 2026 – present").
    period: 'Mar 2026 – present',
    points: [
      'React/Next.js app and Python FastAPI services',
      'Agent observability, agentic workflows, in-product copilot',
      'Security hardening: closed exposed secrets, fixed fail-open auth',
    ],
  },
  {
    company: 'Red Ventures',
    clients: 'SaveOnEnergy · ChooseEnergy · ChooseTexasPower',
    engagement: 'Contract',
    points: [
      'Millions of users/month',
      'Strata plan comparison tool',
      'Introduced trunk-based development for a 12-person team',
    ],
  },
  {
    company: 'Valtech',
    clients: 'Good Eggs · M&M’s Design Your Own (see 03)',
    engagement: 'Contract',
    points: ['Good Eggs: 7,000+ products'],
  },
  {
    company: 'Pacto',
    engagement: 'Contract',
    points: [
      '1,000+ daily users',
      'USD 1M+/day in payments',
      'Component library that cut dev time 35%',
    ],
  },
];
