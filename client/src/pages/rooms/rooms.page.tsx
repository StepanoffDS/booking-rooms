import { useSearchParams } from 'react-router-dom';

import { useOffices } from '@/entities/office';
import { useRooms } from '@/entities/room';
import { OfficeSelector, RoomSearchFilters, toRoomsQuery } from '@/features/room-search';
import { useRoomsFilters } from './model/use-rooms-filters';
import { getRoomsScreenState, RoomsScreen } from './ui/rooms-screen';

function RoomsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.toString();

  const roomsFilters = useRoomsFilters(searchParams, setSearchParams);

  const officesQuery = useOffices();
  const roomsQuery = useRooms(toRoomsQuery(roomsFilters.roomFilters));
  const rooms = roomsQuery.data?.items ?? [];

  const screenState = getRoomsScreenState({
    isLoading: officesQuery.isLoading || roomsQuery.isLoading,
    isError: officesQuery.isError || roomsQuery.isError,
    office: roomsFilters.roomFilters.officeId,
    rooms: roomsQuery.data?.items,
  });

  function handleRetry() {
    void officesQuery.refetch();
    if (roomsFilters.roomFilters.officeId) void roomsQuery.refetch();
  }

  return (
    <main className="flex flex-1 flex-col">
      <OfficeSelector
        offices={officesQuery.data?.items ?? []}
        value={roomsFilters.roomFilters.officeId}
        onChange={(officeId) => roomsFilters.updateFilters({ officeId })}
      />
      <RoomSearchFilters
        filters={roomsFilters.roomFilters}
        onChange={roomsFilters.updateFilters}
        disabled={!roomsFilters.roomFilters.officeId}
      />

      <section
        className="container flex flex-1 flex-col bg-slate-50 px-6 py-10"
        aria-labelledby="rooms-title"
      >
        <RoomsScreen
          state={screenState}
          rooms={rooms}
          search={search}
          onRetry={handleRetry}
          onReset={roomsFilters.resetFilters}
        />
      </section>
    </main>
  );
}

export const Component = RoomsPage;
