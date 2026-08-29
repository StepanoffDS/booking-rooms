import { TZDate } from '@date-fns/tz';
import { format } from 'date-fns';

import type { RoomBooking } from '@/entities/room';

const WORKDAY_START_HOUR = 9;
export const SCHEDULE_SLOT_COUNT = 12;

export type ScheduleSlot = {
  time: string;
  bookings: RoomBooking[];
};

export function getBookingHeight(booking: RoomBooking) {
  return (new Date(booking.endsAt).getTime() - new Date(booking.startsAt).getTime()) / 60_000;
}

export function getScheduleSlots(date: Date, timeZone: string): ScheduleSlot[] {
  return Array.from({ length: SCHEDULE_SLOT_COUNT }, (_, index) => {
    const officeTime = new TZDate(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      WORKDAY_START_HOUR + index,
      0,
      timeZone,
    );

    return { time: format(officeTime, 'HH:00'), bookings: [] };
  });
}

export function groupBookingsBySlot(
  slots: ScheduleSlot[],
  bookings: RoomBooking[],
  timeZone: string,
): ScheduleSlot[] {
  const groupedSlots: ScheduleSlot[] = slots.map((slot) => ({ time: slot.time, bookings: [] }));
  const slotsByTime = new Map(groupedSlots.map((slot) => [slot.time, slot]));

  bookings.forEach((booking) => {
    slotsByTime.get(format(new TZDate(booking.startsAt, timeZone), 'HH:00'))?.bookings.push(booking);
  });

  return groupedSlots;
}
