import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cancelBooking } from '../api/cancel-booking';

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => cancelBooking(bookingId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });
}
