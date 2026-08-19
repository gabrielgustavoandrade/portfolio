import type { ReactNode } from 'react';

export function RailLabel({
  index,
  children,
}: {
  index: string;
  children: ReactNode;
}) {
  return (
    <p className="sys-label">
      <span>{index}</span> {children}
    </p>
  );
}
