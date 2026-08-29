import { TZDate } from '@date-fns/tz';
import { describe, expect, it } from 'vitest';

import {
  getBookingDateBounds,
  isBookingDateAvailable,
  parseBookingDateParam,
  toBookingDateParam,
} from './booking';

describe('booking date rules', () => {
  const timeZone = 'Europe/Moscow';
  const now = new Date('2026-06-15T21:30:00.000Z');

  it('uses the office local calendar date and allows the 30-day boundary', () => {
    const { minDate, maxDate } = getBookingDateBounds(timeZone, now);

    expect(toBookingDateParam(minDate)).toBe('2026-06-16');
    expect(toBookingDateParam(maxDate)).toBe('2026-07-16');
    expect(isBookingDateAvailable(maxDate, timeZone, now)).toBe(true);
    expect(isBookingDateAvailable(new TZDate(2026, 6, 17, timeZone), timeZone, now)).toBe(false);
  });

  it.each([
    ['2026-02-28', '2026-02-28'],
    ['2026-02-30', undefined],
    ['2026-2-28', undefined],
    ['invalid', undefined],
  ])('parses only valid ISO calendar dates: %s', (value, expected) => {
    const date = parseBookingDateParam(value, timeZone);

    expect(date && toBookingDateParam(date)).toBe(expected);
  });
});
