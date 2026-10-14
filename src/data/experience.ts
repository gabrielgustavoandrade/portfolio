export interface Experience {
  company: string;
  clients?: string;
  engagement: string;
  /** Role-level dates from the CV; no per-client dates. */
  period: string;
  points: string[];
}

export const experience: Experience[] = [
  {
    company: 'InteractiveAI',
    engagement: 'Contract',
    period: 'Mar 2026 – Present',
    points: [
      'React/Next.js app and Python FastAPI services',
      'Agent observability, AI workflows, in-product copilot',
      'Security hardening of auth and secrets handling',
    ],
  },
  {
    company: 'Red Ventures',
    clients: 'SaveOnEnergy · ChooseEnergy · ChooseTexasPower',
    engagement: 'Contract',
    period: 'May 2024 – Mar 2026',
    points: [
      'Millions of users/month',
      'Strata plan comparison tool',
      'Introduced trunk-based development for a 12-person team',
    ],
  },
  {
    company: 'Valtech',
    clients: 'Good Eggs · M&M’s Design Your Own',
    engagement: 'Contract',
    period: 'Sep 2021 – May 2024',
    points: ['Good Eggs: 7,000+ products'],
  },
  {
    company: 'Pacto',
    engagement: 'Contract',
    period: 'Jul 2019 – Sep 2021',
    points: [
      '1,000+ daily users',
      'USD 1M+/day in payments',
      'Component library that cut dev time 35%',
    ],
  },
];
