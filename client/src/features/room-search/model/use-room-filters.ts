import { useState } from 'react';

import type { RoomsQuery } from '@/entities/room';

export interface RoomFilters {
  officeId: string;
  date: Date;
  startTime: string;
  durationMinutes: number;
  minCapacity: number;
}

const WORKDAY_START_MINUTES = 9 * 60;
const WORKDAY_END_MINUTES = 20 * 60;
const TIME_STEP_MINUTES = 15;
const MAX_BOOKING_DAYS_AHEAD = 30;

function toStartOfDay(date: Date) {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
}

function formatTime(totalMinutes: number) {
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`;
}

export function getBookingDateBounds(now = new Date()) {
  const minDate = toStartOfDay(now);
  const maxDate = new Date(minDate);
  maxDate.setDate(maxDate.getDate() + MAX_BOOKING_DAYS_AHEAD);
  return { minDate, maxDate };
}

export function getStartTimeOptions(durationMinutes: number) {
  const latestStart = WORKDAY_END_MINUTES - durationMinutes;
  return Array.from(
    { length: Math.floor((latestStart - WORKDAY_START_MINUTES) / TIME_STEP_MINUTES) + 1 },
    (_, index) => formatTime(WORKDAY_START_MINUTES + index * TIME_STEP_MINUTES),
  );
}

function createInitialFilters(officeId = ''): RoomFilters {
  return {
    officeId,
    date: getBookingDateBounds().minDate,
    startTime: '15:00',
    durationMinutes: 60,
    minCapacity: 4,
  };
}

function isAvailableBookingDate(date: Date) {
  const { minDate, maxDate } = getBookingDateBounds();
  const selectedDate = toStartOfDay(date);
  return selectedDate >= minDate && selectedDate <= maxDate;
}

export function useRoomFilters() {
  const [filters, setFilters] = useState(createInitialFilters);

  const updateFilters = (changes: Partial<RoomFilters>) =>
    setFilters((current) => {
      const next = { ...current, ...changes };
      const startTimes = getStartTimeOptions(next.durationMinutes);
      return startTimes.includes(next.startTime)
        ? next
        : { ...next, startTime: startTimes.at(-1) ?? next.startTime };
    });

  const resetFilters = () =>
    setFilters((current) => ({ ...createInitialFilters(current.officeId), minCapacity: 1 }));

  return {
    filters,
    updateFilters,
    resetFilters,
  };
}

export function toRoomsQuery(filters: RoomFilters): RoomsQuery | undefined {
  if (
    !filters.officeId ||
    !isAvailableBookingDate(filters.date) ||
    !getStartTimeOptions(filters.durationMinutes).includes(filters.startTime)
  ) {
    return undefined;
  }

  const [hours, minutes] = filters.startTime.split(':').map(Number);
  const from = new Date(filters.date);
  from.setHours(hours, minutes, 0, 0);

  return {
    officeId: filters.officeId,
    minCapacity: filters.minCapacity,
    from: from.toISOString(),
    to: new Date(from.getTime() + filters.durationMinutes * 60_000).toISOString(),
  };
}
