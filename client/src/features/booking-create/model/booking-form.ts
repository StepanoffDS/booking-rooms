import { TZDate } from '@date-fns/tz';

import {
  TIME_STEP_MINUTES,
  WORKDAY_END_MINUTES,
  WORKDAY_START_MINUTES,
} from '@/shared/model/booking';
import { DEFAULT_TIME } from '@/shared/model/date';

export type BookingFormValues = {
  title: string;
  date: Date;
  startTime: string;
  durationMinutes: number;
  comment: string;
};

export function formatTime(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

export function getTimeMinutes(time: string) {
  return Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;
  const hourLabel = hours === 1 ? 'час' : hours > 1 && hours < 5 ? 'часа' : 'часов';

  return [hours && `${hours} ${hourLabel}`, restMinutes && `${restMinutes} минут`]
    .filter(Boolean)
    .join(' ');
}

export function formatDurationOption(duration: number, startMinutes: number) {
  return `${formatDuration(duration)} (до ${formatTime(startMinutes + duration)})`;
}

export function getDefaultBookingValues(date: Date): BookingFormValues {
  return { title: '', date, startTime: DEFAULT_TIME, durationMinutes: 60, comment: '' };
}

export function getBookingInterval(
  { date, startTime, durationMinutes }: BookingFormValues,
  timeZone: string,
) {
  const startMinutes = getTimeMinutes(startTime);
  const startsAt = new TZDate(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    Math.floor(startMinutes / 60),
    startMinutes % 60,
    timeZone,
  );

  return {
    startsAt: startsAt.toISOString(),
    endsAt: new Date(startsAt.getTime() + durationMinutes * 60_000).toISOString(),
  };
}

export const startTimeOptions = Array.from(
  { length: (WORKDAY_END_MINUTES - WORKDAY_START_MINUTES) / TIME_STEP_MINUTES },
  (_, index) => formatTime(WORKDAY_START_MINUTES + index * TIME_STEP_MINUTES),
);

export function getDurationOptions(startTime: string) {
  const startMinutes = getTimeMinutes(startTime);
  return Array.from(
    { length: (WORKDAY_END_MINUTES - startMinutes) / TIME_STEP_MINUTES },
    (_, index) => (index + 1) * TIME_STEP_MINUTES,
  );
}
