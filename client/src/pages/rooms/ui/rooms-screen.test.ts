import { describe, expect, it } from 'vitest';

import type { Room } from '@/entities/room';

import { getRoomsScreenState } from './rooms-screen';

const rooms = [{
  id: 'room-1',
  officeId: 'office-1',
  name: 'Атлас',
  floor: 4,
  capacity: 8,
  features: [],
  office: { id: 'office-1', name: 'Москва', address: 'Улица', timezone: 'Europe/Moscow' },
}] satisfies Room[];

describe('rooms screen state', () => {
  it.each([
    [{ isLoading: true, isError: true, office: 'office-1', rooms }, 'loading'],
    [{ isLoading: false, isError: true, office: 'office-1', rooms }, 'error'],
    [{ isLoading: false, isError: false, office: '', rooms }, 'select-office'],
    [{ isLoading: false, isError: false, office: 'office-1', rooms: [] }, 'empty'],
    [{ isLoading: false, isError: false, office: 'office-1', rooms }, 'content'],
  ])('selects %s state', (input, expected) => {
    expect(getRoomsScreenState(input)).toBe(expected);
  });
});
