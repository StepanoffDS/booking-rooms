import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../api/cancel-booking', () => ({ cancelBooking: vi.fn() }));

import { cancelBooking } from '../api/cancel-booking';
import { useCancelBooking } from './use-cancel-booking';

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useCancelBooking', () => {
  it('cancels the selected booking and refreshes the bookings list', async () => {
    const queryClient = new QueryClient();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
    vi.mocked(cancelBooking).mockResolvedValue();
    const { result } = renderHook(useCancelBooking, { wrapper: createWrapper(queryClient) });

    await act(async () => {
      await result.current.mutateAsync('booking-1');
    });

    expect(cancelBooking).toHaveBeenCalledWith('booking-1');
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['bookings'] });
  });
});
