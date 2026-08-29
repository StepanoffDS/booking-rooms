import { describe, expect, it } from 'vitest';

import { getBookingsScreenState } from './bookings-screen';

describe('bookings screen state', () => {
  it.each([
    [{ isLoading: true, isError: true }, 'loading'],
    [{ isLoading: false, isError: true }, 'error'],
    [{ isLoading: false, isError: false }, 'content'],
  ] as const)('selects %s state', (input, expected) => {
    expect(getBookingsScreenState(input)).toBe(expected);
  });
});
