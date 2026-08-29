import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createInitialFilters,
  getNextRoomFilters,
  getStartTimeOptions,
  toRoomsQuery,
} from './room-filters';

describe('room filters', () => {
  afterEach(() => vi.useRealTimers());

  it('moves an invalid start time to the last valid time after duration changes', () => {
    const current = {
      ...createInitialFilters('office-1'),
      startTime: '19:00',
      durationMinutes: 60,
    };

    expect(getNextRoomFilters(current, { durationMinutes: 120 }).startTime).toBe('18:00');
  });

  it('does not make a request until office and timezone are known', () => {
    const filters = createInitialFilters();

    expect(toRoomsQuery(filters, 'Europe/Moscow')).toBeUndefined();
    expect(toRoomsQuery({ ...filters, officeId: 'office-1' })).toBeUndefined();
  });

  it('converts valid filters to an office-local interval', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15T09:00:00.000Z'));
    const filters = {
      ...createInitialFilters('office-1'),
      date: new Date(2026, 5, 16),
      startTime: '15:00',
      durationMinutes: 90,
      minCapacity: 8,
    };

    expect(toRoomsQuery(filters, 'Europe/Moscow')).toEqual({
      officeId: 'office-1',
      minCapacity: 8,
      from: '2026-06-16T15:00:00.000+03:00',
      to: '2026-06-16T16:30:00.000+03:00',
    });
  });

  it('limits start time options to the end of the workday', () => {
    expect(getStartTimeOptions(120).at(-1)).toBe('18:00');
  });
});
