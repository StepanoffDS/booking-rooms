import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { Office } from '@/entities/office';

import { storeSelectedOffice, useStoredOffice } from './use-stored-office';

const office = {
  id: 'office-1',
  name: 'Москва',
  address: 'Улица',
  timezone: 'Europe/Moscow',
} satisfies Office;

describe('stored office', () => {
  afterEach(() => localStorage.clear());

  it('restores a valid office into empty search parameters', () => {
    localStorage.setItem('booking-rooms:selected-office', office.id);
    const setSearchParams = vi.fn();
    renderHook(() => useStoredOffice(new URLSearchParams('tab=list'), setSearchParams, [office]));

    const update = setSearchParams.mock.calls[0][0] as (current: URLSearchParams) => URLSearchParams;
    expect(update(new URLSearchParams('tab=list')).toString()).toBe('tab=list&office=office-1');
    expect(setSearchParams.mock.calls[0][1]).toEqual({ replace: true });
  });

  it('persists the selected office', () => {
    storeSelectedOffice(office.id);

    expect(localStorage.getItem('booking-rooms:selected-office')).toBe(office.id);
  });
});
