import { TZDate } from '@date-fns/tz';

export const WORKDAY_START_MINUTES = 9 * 60;
export const WORKDAY_END_MINUTES = 20 * 60;
export const TIME_STEP_MINUTES = 15;
export const MAX_BOOKING_DAYS_AHEAD = 30;

export function toBookingDate(date: Date, timeZone: string) {
  return new TZDate(date.getFullYear(), date.getMonth(), date.getDate(), timeZone);
}

export function getBookingDateBounds(timeZone: string, now = new Date()) {
  const officeNow = new TZDate(now, timeZone);
  const minDate = toBookingDate(officeNow, timeZone);
  const maxDate = new TZDate(
    minDate.getFullYear(),
    minDate.getMonth(),
    minDate.getDate() + MAX_BOOKING_DAYS_AHEAD,
    timeZone,
  );
  return { minDate, maxDate };
}

export function isBookingDateAvailable(date: Date, timeZone: string, now = new Date()) {
  const { minDate, maxDate } = getBookingDateBounds(timeZone, now);
  const selectedDate = toBookingDate(date, timeZone);
  return selectedDate >= minDate && selectedDate <= maxDate;
}

export function toBookingDateParam(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function parseBookingDateParam(value: string | null, timeZone: string) {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return;

  const [year, month, day] = match.slice(1).map(Number);
  const date = new TZDate(year, month - 1, day, timeZone);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    ? date
    : undefined;
}
