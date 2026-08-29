import { useEffect, useMemo } from 'react';

import {
  createInitialFilters,
  getNextRoomFilters,
  getRoomFiltersFromSearchParams,
  roomFiltersToSearchParams,
  type RoomFilters,
} from '@/features/room-search';

type SetSearchParams = (
  next: string | URLSearchParams | ((current: URLSearchParams) => URLSearchParams),
  options?: { replace?: boolean },
) => void;

export function useRoomsFilters(searchParams: URLSearchParams, setSearchParams: SetSearchParams) {
  const search = searchParams.toString();
  const roomFilters = useMemo(
    () => getRoomFiltersFromSearchParams(new URLSearchParams(search)),
    [search],
  );
  const normalizedRoomFilters = useMemo(
    () => roomFiltersToSearchParams(roomFilters, new URLSearchParams(search)).toString(),
    [roomFilters, search],
  );

  useEffect(() => {
    if (search !== normalizedRoomFilters) setSearchParams(normalizedRoomFilters, { replace: true });
  }, [normalizedRoomFilters, search, setSearchParams]);

  function updateFilters(changes: Partial<RoomFilters>) {
    const updatedFilters = getNextRoomFilters(roomFilters, changes);
    setSearchParams((current) => roomFiltersToSearchParams(updatedFilters, current));
  }

  function resetFilters() {
    const nextFilters = { ...createInitialFilters(roomFilters.officeId), minCapacity: 1 };
    setSearchParams((current) => roomFiltersToSearchParams(nextFilters, current));
  }

  return { roomFilters, updateFilters, resetFilters };
}
