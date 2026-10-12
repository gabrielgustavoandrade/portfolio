export interface Experience {
  company: string;
  clients?: string;
  engagement: string;
  points: string[];
}

export const experience: Experience[] = [
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
