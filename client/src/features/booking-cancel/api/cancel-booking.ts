import api from '@/shared/api/instance';

export async function cancelBooking(bookingId: string) {
  await api.delete(`/bookings/${bookingId}`);
}
