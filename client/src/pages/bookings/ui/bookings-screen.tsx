import { TZDate } from '@date-fns/tz';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

import type { Booking } from '@/entities/booking';
import type { Office } from '@/entities/office';
import { CheckCalendarIcon } from '@/shared/assets/icons/check-calendar';
import { DoorsIcon } from '@/shared/assets/icons/doors';
import { ROUTES } from '@/shared/model/routes';
import { ErrorState } from '@/shared/ui/error-state';
import { Button } from '@/shared/ui/kit/button';
import { Skeleton } from '@/shared/ui/kit/skeleton';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/kit/select';
import { BookingsScopeTabs, type BookingScope } from './bookings-scope-tabs';

function getBookingDate(booking: Booking) {
  return new TZDate(booking.startsAt, booking.office.timezone);
}

function BookingCardSkeleton() {
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

function BookingsLoadingScreen() {
  return (
    <div aria-busy="true" aria-label="Загрузка бронирований">
      <div aria-hidden="true">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-72" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <div className="mt-9 flex gap-8 border-b border-border pb-3">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-7 w-28" />
        </div>
      </div>
      <div className="mt-10 space-y-6">
        {[0, 1].map((index) => (
          <BookingCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

function BookingsErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorState
      titleId="bookings-title"
      title="Не удалось загрузить данные"
      description="Произошла ошибка при загрузке ваших бронирований"
      onRetry={onRetry}
      className="flex-1 pb-24"
    />
  );
}

function EmptyBookingsScreen({ scope }: { scope: BookingScope }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center justify-center pb-24 text-center">
      <div className="flex size-36 items-center justify-center rounded-full bg-teal-100">
        <CheckCalendarIcon aria-hidden="true" className="size-14" />
      </div>
      <h2 className="mt-9 text-4xl font-bold">Нет бронирований</h2>
      <p className="mt-3 max-w-xl text-xl text-muted-foreground">
        У вас пока нет {scope === 'upcoming' ? 'предстоящих' : 'прошедших'} бронирований.
        {scope === 'upcoming' && ' Перейдите в раздел переговорных, чтобы забронировать комнату.'}
      </p>
      <Button
        className="mt-7 h-13 rounded-lg px-6 text-base font-bold"
        onClick={() => navigate(ROUTES.ROOMS)}
      >
        Перейти к переговорным
      </Button>
    </div>
  );
}

function BookingCard({
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
            {format(new TZDate(booking.endsAt, booking.office.timezone), 'HH:mm')} MSK
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

function BookingsListScreen({
  bookings,
  scope,
  upcomingCount,
  officeId,
  offices,
  onScopeChange,
  onOfficeChange,
  onCancel,
}: {
  bookings: Booking[];
  scope: BookingScope;
  upcomingCount: number;
  officeId: string;
  offices: Office[];
  onScopeChange: (scope: BookingScope) => void;
  onOfficeChange: (officeId: string) => void;
  onCancel: (booking: Booking) => void;
}) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-6">
        <h1 id="bookings-title" className="text-4xl font-bold">
          Мои бронирования
        </h1>
        <Select value={officeId} onValueChange={(value) => value && onOfficeChange(value)}>
          <SelectTrigger aria-label="Офис" className="h-10 min-h-10 min-w-36 bg-card px-4 text-sm">
            <SelectValue>Все офисы</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Все офисы</SelectItem>
              {offices.map((office) => (
                <SelectItem key={office.id} value={office.id}>
                  {office.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <BookingsScopeTabs scope={scope} upcomingCount={upcomingCount} onScopeChange={onScopeChange} />

      <div className="mt-10 flex flex-1 flex-col">
        {!bookings.length ? (
          <EmptyBookingsScreen scope={scope} />
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                canCancel={scope === 'upcoming'}
                onCancel={() => onCancel(booking)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

type BookingsScreenState = 'loading' | 'error' | 'content';

export function getBookingsScreenState({
  isLoading,
  isError,
}: {
  isLoading: boolean;
  isError: boolean;
}): BookingsScreenState {
  if (isLoading) return 'loading';
  if (isError) return 'error';
  return 'content';
}

export function BookingsScreen({
  state,
  bookings,
  scope,
  upcomingCount,
  officeId,
  offices,
  onRetry,
  onScopeChange,
  onOfficeChange,
  onCancel,
}: {
  state: BookingsScreenState;
  bookings: Booking[];
  scope: BookingScope;
  upcomingCount: number;
  officeId: string;
  offices: Office[];
  onRetry: () => void;
  onScopeChange: (scope: BookingScope) => void;
  onOfficeChange: (officeId: string) => void;
  onCancel: (booking: Booking) => void;
}) {
  switch (state) {
    case 'loading':
      return <BookingsLoadingScreen />;
    case 'error':
      return <BookingsErrorScreen onRetry={onRetry} />;
    case 'content':
      return (
        <BookingsListScreen
          bookings={bookings}
          scope={scope}
          upcomingCount={upcomingCount}
          officeId={officeId}
          offices={offices}
          onScopeChange={onScopeChange}
          onOfficeChange={onOfficeChange}
          onCancel={onCancel}
        />
      );
  }
}
