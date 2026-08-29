import { afterEach, describe, expect, it, vi } from 'vitest';

import { getRoomFiltersFromSearchParams, roomFiltersToSearchParams } from './query-params';

describe('room filter query parameters', () => {
  afterEach(() => vi.useRealTimers());

  it('normalizes invalid values while retaining valid and unrelated parameters', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-16T09:00:00.000Z'));
    const params = new URLSearchParams(
      'office=office-1&date=2026-06-20&startTime=19:00&durationMinutes=120&minCapacity=0&tab=list',
    );

    const filters = getRoomFiltersFromSearchParams(params, 'Europe/Moscow');
    const normalized = roomFiltersToSearchParams(filters, params);

    expect(filters).toMatchObject({
      officeId: 'office-1',
      startTime: '18:00',
      durationMinutes: 120,
      minCapacity: 4,
    });
    expect(normalized.get('tab')).toBe('list');
    expect(normalized.get('minCapacity')).toBe('4');
    expect(normalized.get('startTime')).toBe('18:00');
  });

  it('removes an empty office from the URL', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-16T09:00:00.000Z'));

    const filters = getRoomFiltersFromSearchParams(new URLSearchParams('office='));
    expect(roomFiltersToSearchParams(filters, new URLSearchParams('office=&tab=list')).has('office')).toBe(false);
  });
});
