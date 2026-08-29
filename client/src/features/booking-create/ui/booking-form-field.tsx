import type { ReactNode } from 'react';

export function BookingFormField({ title, children }: { title: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-bold text-muted-foreground">{title}</span>
      {children}
    </label>
  );
}
