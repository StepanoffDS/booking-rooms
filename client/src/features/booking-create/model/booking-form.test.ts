import { describe, expect, it } from 'vitest';

import {
  formatDuration,
  getBookingInterval,
  getDurationOptions,
  startTimeOptions,
} from './booking-form';

describe('booking form rules', () => {
  it('builds an interval in the office timezone', () => {
    const interval = getBookingInterval({
      title: 'Планирование',
      date: new Date(2026, 5, 16),
      startTime: '15:00',
      durationMinutes: 90,
      comment: '',
    }, 'Europe/Moscow');

    expect(interval).toEqual({
      startsAt: '2026-06-16T15:00:00.000+03:00',
      endsAt: '2026-06-16T16:30:00.000+03:00',
    });
  });

  it('offers only 15-minute slots within the workday', () => {
    expect(startTimeOptions).toHaveLength(44);
    expect(startTimeOptions.at(0)).toBe('09:00');
    expect(startTimeOptions.at(-1)).toBe('19:45');
    expect(getDurationOptions('19:45')).toEqual([15]);
    expect(getDurationOptions('19:00')).toEqual([15, 30, 45, 60]);
  });

  it.each([
    [60, '1 час'],
    [120, '2 часа'],
    [300, '5 часов'],
    [75, '1 час 15 минут'],
  ])('formats Russian duration labels: %i', (minutes, expected) => {
    expect(formatDuration(minutes)).toBe(expected);
  });
});
