import { format } from 'date-fns';

import type { RoomBooking } from '@/entities/room';

export const timeSlots = Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, '0')}:00`);

export type ScheduleSlot = {
  time: string;
  bookings: RoomBooking[];
};

export function groupBookingsBySlot(bookings: RoomBooking[]): ScheduleSlot[] {
  const slots: ScheduleSlot[] = timeSlots.map((time) => ({ time, bookings: [] }));
  const slotsByTime = new Map(slots.map((slot) => [slot.time, slot]));

  bookings.forEach((booking) => {
    slotsByTime.get(format(new Date(booking.startsAt), 'HH:00'))?.bookings.push(booking);
  });

  return slots;
}
