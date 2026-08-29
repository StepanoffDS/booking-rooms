import type { RoomsQuery } from '@/entities/room';
import { TZDate } from '@date-fns/tz';
import {
  getBookingDateBounds,
  isBookingDateAvailable,
  TIME_STEP_MINUTES,
  WORKDAY_END_MINUTES,
  WORKDAY_START_MINUTES,
} from '@/shared/model/booking';
import { DEFAULT_TIME } from '@/shared/model/date';

export { getBookingDateBounds } from '@/shared/model/booking';

export interface RoomFilters {
  officeId: string;
  date: Date;
  startTime: string;
  durationMinutes: number;
  minCapacity: number;
}

function formatTime(totalMinutes: number) {
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`;
}

export function getStartTimeOptions(durationMinutes: number) {
  const latestStart = WORKDAY_END_MINUTES - durationMinutes;
  return Array.from(
    { length: Math.floor((latestStart - WORKDAY_START_MINUTES) / TIME_STEP_MINUTES) + 1 },
    (_, index) => formatTime(WORKDAY_START_MINUTES + index * TIME_STEP_MINUTES),
  );
}

export function createInitialFilters(officeId = '', timeZone = 'UTC'): RoomFilters {
  return {
    officeId,
    date: getBookingDateBounds(timeZone).minDate,
    startTime: DEFAULT_TIME,
    durationMinutes: 60,
    minCapacity: 4,
  };
}

export function getNextRoomFilters(current: RoomFilters, changes: Partial<RoomFilters>) {
  const next = { ...current, ...changes };
  const startTimes = getStartTimeOptions(next.durationMinutes);
  return startTimes.includes(next.startTime)
    ? next
    : { ...next, startTime: startTimes.at(-1) ?? next.startTime };
}

export function toRoomsQuery(filters: RoomFilters, timeZone?: string): RoomsQuery | undefined {
  if (
    !filters.officeId ||
    !timeZone ||
    !isBookingDateAvailable(filters.date, timeZone) ||
    !getStartTimeOptions(filters.durationMinutes).includes(filters.startTime)
  ) {
    return undefined;
  }

  const [hours, minutes] = filters.startTime.split(':').map(Number);
  const from = new TZDate(
    filters.date.getFullYear(),
    filters.date.getMonth(),
    filters.date.getDate(),
    hours,
    minutes,
    timeZone,
  );

  return {
    officeId: filters.officeId,
    minCapacity: filters.minCapacity,
    from: from.toISOString(),
    to: new TZDate(from.getTime() + filters.durationMinutes * 60_000, timeZone).toISOString(),
  };
}
