import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../api/create-booking', () => ({ createBooking: vi.fn() }));
vi.mock('@/shared/ui/kit/toast', () => ({ toast: { add: vi.fn() } }));

import type { RoomDetails } from '@/entities/room';
import { ApiError } from '@/shared/api/instance';
import { createBooking, type CreatedBooking } from '../api/create-booking';
import { useCreateBooking } from './use-create-booking';

const room = {
  id: 'room-1',
  officeId: 'office-1',
  name: 'Атлас',
  floor: 4,
  capacity: 8,
  features: [],
  office: { id: 'office-1', name: 'Москва', address: 'Улица', timezone: 'Europe/Moscow' },
} satisfies RoomDetails;

const createdBooking = {
  id: 'booking-1',
  roomId: room.id,
  userId: 'user-1',
  title: 'Планирование',
  comment: null,
  startsAt: '2026-06-16T15:00:00.000+03:00',
  endsAt: '2026-06-16T16:00:00.000+03:00',
  createdAt: '2026-06-01T10:00:00.000Z',
  room: { id: room.id, officeId: room.officeId, name: room.name, floor: room.floor, capacity: room.capacity, features: [] },
  office: room.office,
  owner: {
    id: 'user-1',
    login: 'user',
    displayName: 'Пользователь',
    email: 'user@example.com',
    avatarUrl: null,
    initials: 'П',
  },
} satisfies CreatedBooking;

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useCreateBooking', () => {
  it('creates a timezone-aware booking, trims the comment, and refreshes the schedule', async () => {
    const queryClient = new QueryClient();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
    const onSuccess = vi.fn();
    vi.mocked(createBooking).mockResolvedValue(createdBooking);
    const { result } = renderHook(
      () => useCreateBooking({ room, onSuccess, onConflict: vi.fn() }),
      { wrapper: createWrapper(queryClient) },
    );

    await act(async () => {
      await result.current.mutateAsync({
        title: 'Планирование',
        date: new Date(2026, 5, 16),
        startTime: '15:00',
        durationMinutes: 60,
        comment: '  Обсудить план  ',
      });
    });

    expect(createBooking).toHaveBeenCalledWith({
      roomId: 'room-1',
      title: 'Планирование',
      comment: 'Обсудить план',
      startsAt: '2026-06-16T15:00:00.000+03:00',
      endsAt: '2026-06-16T16:00:00.000+03:00',
    });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['rooms', room.id, 'bookings'] });
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it('handles booking conflicts and refreshes stale schedule data', async () => {
    const queryClient = new QueryClient();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
    const onConflict = vi.fn();
    const conflict = new ApiError('Комната уже занята', 'BOOKING_CONFLICT', 409);
    vi.mocked(createBooking).mockRejectedValue(conflict);
    const { result } = renderHook(
      () => useCreateBooking({ room, onSuccess: vi.fn(), onConflict }),
      { wrapper: createWrapper(queryClient) },
    );

    await act(async () => {
      await expect(result.current.mutateAsync({
        title: 'Планирование',
        date: new Date(2026, 5, 16),
        startTime: '15:00',
        durationMinutes: 60,
        comment: '',
      })).rejects.toThrow(conflict);
    });

    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['rooms', room.id, 'bookings'] });
    expect(onConflict).toHaveBeenCalledOnce();
  });
});
