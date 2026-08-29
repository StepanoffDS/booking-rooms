import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useRoomDate } from './use-room-date';

describe('useRoomDate', () => {
  afterEach(() => vi.useRealTimers());

  it('normalizes an invalid date and updates the URL when the user selects a date', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-16T09:00:00.000Z'));
    const setSearchParams = vi.fn();
    const { result } = renderHook(() => useRoomDate(new URLSearchParams('date=invalid'), setSearchParams, 'Europe/Moscow'));

    expect(result.current.selectedDate.toISOString()).toContain('2026-06-16');
    expect(setSearchParams).toHaveBeenCalledWith(expect.any(Function), { replace: true });

    act(() => result.current.selectDate(new Date(2026, 5, 20)));

    const update = setSearchParams.mock.calls.at(-1)?.[0] as (current: URLSearchParams) => URLSearchParams;
    expect(update(new URLSearchParams('tab=list')).toString()).toBe('tab=list&date=2026-06-20');
    expect(result.current.isDatePickerOpen).toBe(false);
  });
});
