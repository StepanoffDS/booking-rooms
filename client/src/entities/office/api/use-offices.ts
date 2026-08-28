import { useQuery } from '@tanstack/react-query';

import api from '@/shared/api/instance';
import type { OfficesResponse } from '../model/types';

async function getOffices(): Promise<OfficesResponse> {
  const { data } = await api.get<OfficesResponse>('/offices');
  return data;
}

export function useOffices() {
  return useQuery({ queryKey: ['offices'], queryFn: getOffices });
}
