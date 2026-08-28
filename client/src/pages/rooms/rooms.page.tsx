import { useOffices } from '@/entities/office';
import { useRooms } from '@/entities/room';
import {
  OfficeSelector,
  RoomSearchFilters,
  toRoomsQuery,
  useRoomFilters,
} from '@/features/room-search';
import { getRoomsScreenState, RoomsScreen } from './ui/RoomsScreen';

function RoomsPage() {
  const { filters, updateFilters, resetFilters } = useRoomFilters();
  const officesQuery = useOffices();
  const roomsQuery = useRooms(toRoomsQuery(filters));
  const rooms = roomsQuery.data?.items ?? [];
  const screenState = getRoomsScreenState({
    isLoading: officesQuery.isLoading || roomsQuery.isLoading,
    isError: officesQuery.isError || roomsQuery.isError,
    office: filters.officeId,
    rooms: roomsQuery.data?.items,
  });

  function handleRetry() {
    void officesQuery.refetch();
    if (filters.officeId) void roomsQuery.refetch();
  }

  return (
    <main className="flex flex-1 flex-col">
      <OfficeSelector
        offices={officesQuery.data?.items ?? []}
        value={filters.officeId}
        onChange={(officeId) => updateFilters({ officeId })}
      />
      <RoomSearchFilters filters={filters} onChange={updateFilters} disabled={!filters.officeId} />

      <section
        className="container flex flex-1 flex-col bg-slate-50 px-6 py-10"
        aria-labelledby="rooms-title"
      >
        <RoomsScreen
          state={screenState}
          rooms={rooms}
          onRetry={handleRetry}
          onReset={resetFilters}
        />
      </section>
    </main>
  );
}

export const Component = RoomsPage;
