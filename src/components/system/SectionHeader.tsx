import type { ReactNode } from 'react';

export function SectionHeader({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="sys-section__header enter" data-enter>
      <p className="sys-label">
        <span>{index}</span>
      </p>
      <h2 className="sys-section__title">{title}</h2>
      {children}
    </header>
  );
}
