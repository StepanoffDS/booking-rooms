import { TZDate } from '@date-fns/tz';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import type { Booking } from '@/entities/booking';
import { DoorsIcon } from '@/shared/assets/icons/doors';
import { Button } from '@/shared/ui/kit/button';
import { Skeleton } from '@/shared/ui/kit/skeleton';

function getBookingDate(booking: Booking) {
  return new TZDate(booking.startsAt, booking.office.timezone);
}

export function BookingCardSkeleton() {
  return (
    <article className="flex items-center gap-5 rounded-xl bg-card p-5 ring-1 ring-border">
      <Skeleton className="size-24 rounded-xl" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-6 w-1/3" />
        <div className="flex gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="h-10 w-28" />
    </article>
  );
}

export function BookingCard({
  booking,
  canCancel,
  onCancel,
}: {
  booking: Booking;
  canCancel: boolean;
  onCancel: () => void;
}) {
  const date = getBookingDate(booking);
  const month = format(date, 'LLLL', { locale: ru }).toUpperCase();

  return (
    <article className="flex flex-wrap items-center gap-5 rounded-xl bg-card p-5 ring-1 ring-border">
      <time
        dateTime={booking.startsAt}
        className="flex size-24 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-50"
      >
        <span className="text-xs font-bold text-slate-400">{month}</span>
        <span className="mt-1 text-2xl font-bold">{format(date, 'd')}</span>
      </time>
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-xl font-bold">{booking.title}</h2>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5 font-semibold text-primary">
            <DoorsIcon aria-hidden="true" />
            {booking.room.name}
          </span>
          <span aria-hidden="true">•</span>
          <span>{booking.room.floor} этаж</span>
          <span aria-hidden="true">•</span>
          <span>
            {format(date, 'HH:mm')} –{' '}
            {format(new TZDate(booking.endsAt, booking.office.timezone), 'HH:mm')}
          </span>
        </div>
      </div>
      {canCancel && (
        <Button
          variant="destructive"
          className="h-10 border border-destructive bg-transparent px-5 text-sm font-bold"
          onClick={onCancel}
        >
          Отменить
        </Button>
      )}
    </article>
  );
}
