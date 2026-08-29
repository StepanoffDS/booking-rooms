import type { ReactNode } from 'react';

export function BookingsLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-1 ">
      <section
        className="container flex flex-1 flex-col px-6 py-10 lg:px-10 bg-slate-50"
        aria-labelledby="bookings-title"
      >
        {children}
      </section>
    </main>
  );
}
