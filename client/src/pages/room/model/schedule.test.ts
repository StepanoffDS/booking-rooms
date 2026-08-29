import { describe, expect, it } from 'vitest';

import type { RoomBooking } from '@/entities/room';

import { getBookingHeight, getScheduleSlots, groupBookingsBySlot } from './schedule';

function booking(id: string, startsAt: string, endsAt: string): RoomBooking {
  return {
    id,
    roomId: 'room-1',
    userId: 'user-1',
    title: 'Встреча',
    comment: null,
    startsAt,
    endsAt,
    createdAt: startsAt,
    room: { id: 'room-1', officeId: 'office-1', name: 'Атлас', floor: 4, capacity: 8, features: [] },
    office: { id: 'office-1', name: 'Москва', address: 'Улица', timezone: 'Europe/Moscow' },
    owner: {
      id: 'user-1',
      login: 'user',
      displayName: 'Пользователь',
      email: 'user@example.com',
      avatarUrl: null,
      initials: 'П',
    },
  };
}

describe('room schedule', () => {
  it('creates office-local slots and groups bookings by their local hour', () => {
    const slots = getScheduleSlots(new Date(2026, 5, 16), 'Europe/Moscow');
    const roomBooking = booking(
      'booking-1',
      '2026-06-16T12:30:00.000Z',
      '2026-06-16T14:00:00.000Z',
    );

    const grouped = groupBookingsBySlot(slots, [roomBooking], 'Europe/Moscow');

    expect(slots.map((slot) => slot.time)).toEqual([
      '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
      '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
    ]);
    expect(grouped.find((slot) => slot.time === '15:00')?.bookings).toEqual([roomBooking]);
    expect(getBookingHeight(roomBooking)).toBe(90);
  });
});
