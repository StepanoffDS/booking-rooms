import { useQuery } from '@tanstack/react-query';

import api from '@/shared/api/instance';
import type { BookingsQuery, BookingsResponse } from '../model/types';

async function getBookings(params: BookingsQuery): Promise<BookingsResponse> {
  const { data } = await api.get<BookingsResponse>('/bookings', { params });
  return data;
}

export function useBookings(params: BookingsQuery) {
  return useQuery({ queryKey: ['bookings', params], queryFn: () => getBookings(params) });
}
