import { useQuery } from '@tanstack/react-query';

import api from '@/shared/api/instance';
import type { RoomsQuery, RoomsResponse } from '../model/types';

async function getRooms(params: RoomsQuery): Promise<RoomsResponse> {
  const { data } = await api.get<RoomsResponse>('/rooms', { params });
  return data;
}

export function useRooms(params?: RoomsQuery) {
  return useQuery({
    queryKey: ['rooms', params],
    queryFn: () => getRooms(params!),
    enabled: params !== undefined,
  });
}
