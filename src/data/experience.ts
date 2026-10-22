/** Engagement, role-level dates and points live in i18n/messages. */
export interface Experience {
  company: string;
  clients?: string;
}

export const experience: Experience[] = [
  {
    company: 'InteractiveAI',
  },
  {
    company: 'Red Ventures',
    clients: 'SaveOnEnergy · ChooseEnergy · ChooseTexasPower',
  },
  {
    company: 'Valtech',
    clients: 'Good Eggs · M&M’s Design Your Own',
  },
  {
    company: 'Pacto',
  },
];
