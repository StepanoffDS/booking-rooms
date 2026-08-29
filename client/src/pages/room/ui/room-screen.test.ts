import { describe, expect, it } from 'vitest';

import type { RoomDetails } from '@/entities/room';

import { getRoomScreenState } from './room-screen';

const room = {
  id: 'room-1',
  officeId: 'office-1',
  name: 'Атлас',
  floor: 4,
  capacity: 8,
  features: [],
  office: { id: 'office-1', name: 'Москва', address: 'Улица', timezone: 'Europe/Moscow' },
} satisfies RoomDetails;

describe('room screen state', () => {
  it.each([
    [{ isLoading: true, isError: true, room }, 'loading'],
    [{ isLoading: false, isError: true, room }, 'error'],
    [{ isLoading: false, isError: false, room: undefined }, 'error'],
    [{ isLoading: false, isError: false, room }, 'content'],
  ] as const)('selects %s state', (input, expected) => {
    expect(getRoomScreenState(input)).toBe(expected);
  });
});
