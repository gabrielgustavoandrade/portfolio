export type HeroWorkCard =
  | {
      id: 'earth' | 'smart-date-input';
      index: string;
      title: string;
      href: string;
      kind: 'link';
    }
  | {
      id: 'commerce';
      index: string;
      title: string;
      kind: 'placeholder';
    };

export const heroWorkCards: HeroWorkCard[] = [
  {
    id: 'earth',
    index: '01',
    title: 'Earth',
    href: '#build-log',
    kind: 'link',
  },
  {
    id: 'smart-date-input',
    index: '02',
    title: 'smart-date-input',
    href: '/work/smart-date-input',
    kind: 'link',
  },
  {
    id: 'commerce',
    index: '03',
    title: 'Commerce',
    kind: 'placeholder',
  },
];
