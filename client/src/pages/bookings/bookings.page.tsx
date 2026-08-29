import { useState } from 'react';

import { type Booking, useBookings } from '@/entities/booking';
import { useOffices } from '@/entities/office';
import { CancelBookingDialog } from '@/features/booking-cancel';
import { type BookingScope } from './ui/bookings-scope-tabs';
import { BookingsLayout } from './ui/bookings-layout';
import { BookingsScreen, getBookingsScreenState } from './ui/bookings-screen';

function BookingsPage() {
  const [scope, setScope] = useState<BookingScope>('upcoming');
  const [officeId, setOfficeId] = useState('all');
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

  const officeFilter = officeId === 'all' ? {} : { officeId };
  const officesQuery = useOffices();
  const upcomingBookingsQuery = useBookings({ scope: 'upcoming', ...officeFilter });
  const pastBookingsQuery = useBookings({ scope: 'past', ...officeFilter });

  const bookingsQuery = scope === 'upcoming' ? upcomingBookingsQuery : pastBookingsQuery;
  const isLoading = officesQuery.isLoading || bookingsQuery.isLoading;
  const isError = officesQuery.isError || bookingsQuery.isError;
  const bookings = bookingsQuery.data?.items ?? [];
  const upcomingCount = upcomingBookingsQuery.data?.items.length ?? 0;
  const screenState = getBookingsScreenState({ isLoading, isError });

  function retry() {
    void officesQuery.refetch();
    void upcomingBookingsQuery.refetch();
    void pastBookingsQuery.refetch();
  }

  return (
    <BookingsLayout>
      <BookingsScreen
        state={screenState}
        bookings={bookings}
        scope={scope}
        upcomingCount={upcomingCount}
        officeId={officeId}
        offices={officesQuery.data?.items ?? []}
        onRetry={retry}
        onScopeChange={setScope}
        onOfficeChange={setOfficeId}
        onCancel={setBookingToCancel}
      />
      <CancelBookingDialog
        booking={bookingToCancel}
        onOpenChange={(open) => !open && setBookingToCancel(null)}
      />
    </BookingsLayout>
  );
}

export const Component = BookingsPage;
