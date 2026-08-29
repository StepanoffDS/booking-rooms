export const WORKDAY_START_MINUTES = 9 * 60;
export const WORKDAY_END_MINUTES = 20 * 60;
export const TIME_STEP_MINUTES = 15;
export const MAX_BOOKING_DAYS_AHEAD = 30;

function toStartOfDay(date: Date) {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
}

export function getBookingDateBounds(now = new Date()) {
  const minDate = toStartOfDay(now);
  const maxDate = new Date(minDate);
  maxDate.setDate(maxDate.getDate() + MAX_BOOKING_DAYS_AHEAD);
  return { minDate, maxDate };
}

export function isBookingDateAvailable(date: Date, now = new Date()) {
  const { minDate, maxDate } = getBookingDateBounds(now);
  const selectedDate = toStartOfDay(date);
  return selectedDate >= minDate && selectedDate <= maxDate;
}

export function toBookingDateParam(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function parseBookingDateParam(value: string | null) {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return;

  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    ? date
    : undefined;
}
