import { useQuery } from '@tanstack/react-query';

import api from '@/shared/api/instance';
import { getStoredCurrentUser, storeCurrentUser } from '../model/current-user-storage';
import type { CurrentUser } from '../model/types';

async function getCurrentUser(): Promise<CurrentUser> {
  const storedUser = getStoredCurrentUser();
  if (storedUser) return storedUser;

  const { data } = await api.get<CurrentUser>('/me');
  storeCurrentUser(data);
  return data;
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
    staleTime: Infinity,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
