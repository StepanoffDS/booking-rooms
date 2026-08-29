import type { RoomBooking, RoomDetails } from '@/entities/room';

function escapeIcs(value: string) {
  return value
    .replaceAll('\\', '\\\\')
    .replace(/\r\n?|\n/g, '\\n')
    .replaceAll(',', '\\,')
    .replaceAll(';', '\\;');
}

function toIcsDate(value: Date | string) {
  return new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function downloadBookingsIcs(room: RoomDetails, bookings: RoomBooking[]) {
  const timestamp = toIcsDate(new Date());
  const content = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//booking-rooms//EN',
    'CALSCALE:GREGORIAN',
    ...bookings.flatMap((booking) => [
      'BEGIN:VEVENT',
      `UID:${booking.id}@booking-rooms`,
      `DTSTAMP:${timestamp}`,
      `DTSTART:${toIcsDate(booking.startsAt)}`,
      `DTEND:${toIcsDate(booking.endsAt)}`,
      `SUMMARY:${escapeIcs(booking.title)}`,
      `LOCATION:${escapeIcs(`${room.name}, ${room.floor} этаж, ${room.office.address}`)}`,
      ...(booking.comment ? [`DESCRIPTION:${escapeIcs(booking.comment)}`] : []),
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
    '',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `bookings-${room.id}.ics`;
  link.click();
  URL.revokeObjectURL(url);
}
