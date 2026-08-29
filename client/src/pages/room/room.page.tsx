import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { useRoom, useRoomBookings } from '@/entities/room';
import { useRoomDate } from './model/use-room-date';
import { groupBookingsBySlot } from './model/schedule';
import { getRoomScreenState, RoomScreen } from './ui/room-screen';

function RoomPage() {
  const { roomId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.toString();

  const roomDate = useRoomDate(searchParams, setSearchParams);
  const roomQuery = useRoom(roomId);

  const scheduleQuery = useMemo(() => {
    const from = new Date(roomDate.selectedDate);
    from.setHours(0, 0, 0, 0);
    const to = new Date(from);
    to.setDate(to.getDate() + 1);
    return { from: from.toISOString(), to: to.toISOString() };
  }, [roomDate.selectedDate]);
  const bookingsQuery = useRoomBookings(roomId, scheduleQuery);

  const scheduleSlots = useMemo(
    () => groupBookingsBySlot(bookingsQuery.data?.items ?? []),
    [bookingsQuery.data?.items],
  );

  const screenState = getRoomScreenState({
    isLoading: roomQuery.isLoading || bookingsQuery.isLoading,
    isError: !roomId || roomQuery.isError || bookingsQuery.isError,
    room: roomQuery.data,
  });

  function handleRetry() {
    void roomQuery.refetch();
    void bookingsQuery.refetch();
  }

  return (
    <RoomScreen
      state={screenState}
      room={roomQuery.data}
      scheduleSlots={scheduleSlots}
      search={search}
      roomDate={roomDate}
      onRetry={handleRetry}
    />
  );
}

export const Component = RoomPage;
