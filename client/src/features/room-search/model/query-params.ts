import {
  isBookingDateAvailable,
  parseBookingDateParam,
  TIME_STEP_MINUTES,
  toBookingDateParam,
  WORKDAY_END_MINUTES,
  WORKDAY_START_MINUTES,
} from '@/shared/model/booking';

import { createInitialFilters, getNextRoomFilters, type RoomFilters } from './room-filters';

const FILTER_PARAM = {
  officeId: 'office',
  date: 'date',
  startTime: 'startTime',
  durationMinutes: 'durationMinutes',
  minCapacity: 'minCapacity',
} as const;

function getPositiveInteger(value: string | null, fallback: number) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
}

function getDuration(value: string | null, fallback: number) {
  const duration = getPositiveInteger(value, fallback);
  const workdayDuration = WORKDAY_END_MINUTES - WORKDAY_START_MINUTES;
  return duration >= TIME_STEP_MINUTES &&
    duration <= workdayDuration &&
    duration % TIME_STEP_MINUTES === 0
    ? duration
    : fallback;
}

export function getRoomFiltersFromSearchParams(searchParams: URLSearchParams): RoomFilters {
  const defaults = createInitialFilters(searchParams.get(FILTER_PARAM.officeId) ?? '');
  const date = parseBookingDateParam(searchParams.get(FILTER_PARAM.date));
  const durationMinutes = getDuration(
    searchParams.get(FILTER_PARAM.durationMinutes),
    defaults.durationMinutes,
  );

  return getNextRoomFilters(defaults, {
    date: date && isBookingDateAvailable(date) ? date : defaults.date,
    startTime: searchParams.get(FILTER_PARAM.startTime) ?? defaults.startTime,
    durationMinutes,
    minCapacity: getPositiveInteger(
      searchParams.get(FILTER_PARAM.minCapacity),
      defaults.minCapacity,
    ),
  });
}

export function roomFiltersToSearchParams(filters: RoomFilters, current = new URLSearchParams()) {
  const next = new URLSearchParams(current);
  const values = {
    [FILTER_PARAM.date]: toBookingDateParam(filters.date),
    [FILTER_PARAM.startTime]: filters.startTime,
    [FILTER_PARAM.durationMinutes]: String(filters.durationMinutes),
    [FILTER_PARAM.minCapacity]: String(filters.minCapacity),
  };

  if (filters.officeId) {
    next.set(FILTER_PARAM.officeId, filters.officeId);
  } else {
    next.delete(FILTER_PARAM.officeId);
  }

  Object.entries(values).forEach(([key, value]) => next.set(key, value));
  return next;
}
