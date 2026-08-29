import { TZDate } from '@date-fns/tz';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { createBooking } from '../api/create-booking';
import { getBookingInterval, type BookingFormValues } from './booking-form';
import type { RoomDetails } from '@/entities/room';
import { ApiError } from '@/shared/api/instance';
import { toast } from '@/shared/ui/kit/toast';
import { DATE_FORMAT } from '@/shared/model/date';

type UseCreateBookingOptions = {
  room: RoomDetails;
  onSuccess: () => void;
  onConflict: () => void;
};

export function useCreateBooking({ room, onSuccess, onConflict }: UseCreateBookingOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: BookingFormValues) =>
      createBooking({
        roomId: room.id,
        title: values.title,
        comment: values.comment.trim() || null,
        ...getBookingInterval(values, room.office.timezone),
      }),
    onSuccess: async (booking) => {
      await queryClient.invalidateQueries({ queryKey: ['rooms', room.id, 'bookings'] });
      const startsAt = new TZDate(booking.startsAt, room.office.timezone);
      const endsAt = new TZDate(booking.endsAt, room.office.timezone);

      toast.add({
        type: 'success',
        title: 'Бронирование создано',
        description: `Комната ${room.name}, ${format(startsAt, DATE_FORMAT, { locale: ru })}, ${format(startsAt, 'HH:mm')}–${format(endsAt, 'HH:mm')} MSK`,
      });
      onSuccess();
    },
    onError: async (error) => {
      if (!(error instanceof ApiError) || error.code !== 'BOOKING_CONFLICT') return;
      await queryClient.invalidateQueries({ queryKey: ['rooms', room.id, 'bookings'] });
      onConflict();
    },
  });
}
