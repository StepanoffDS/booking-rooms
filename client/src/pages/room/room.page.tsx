import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { TZDate } from '@date-fns/tz';

import { useRoom, useRoomBookings } from '@/entities/room';
import { useRoomDate } from './model/use-room-date';
import { getScheduleSlots, groupBookingsBySlot } from './model/schedule';
import { getRoomScreenState, RoomScreen } from './ui/room-screen';

function RoomPage() {
  const { roomId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.toString();

  const roomQuery = useRoom(roomId);
  const timeZone = roomQuery.data?.office.timezone;
  const roomDate = useRoomDate(searchParams, setSearchParams, timeZone);

  const scheduleQuery = useMemo(() => {
    if (!timeZone) return undefined;
    const from = new TZDate(
      roomDate.selectedDate.getFullYear(),
      roomDate.selectedDate.getMonth(),
      roomDate.selectedDate.getDate(),
      timeZone,
    );
    const to = new TZDate(
      from.getFullYear(),
      from.getMonth(),
      from.getDate() + 1,
      timeZone,
    );
    return { from: from.toISOString(), to: to.toISOString() };
  }, [roomDate.selectedDate, timeZone]);

  const bookingsQuery = useRoomBookings(roomId, scheduleQuery);

  const scheduleSlots = useMemo(() => {
    if (!timeZone) return [];

    const slots = getScheduleSlots(roomDate.selectedDate, timeZone);
    const bookings = bookingsQuery.data?.items ?? [];

    return groupBookingsBySlot(slots, bookings, timeZone);
  }, [bookingsQuery.data?.items, roomDate.selectedDate, timeZone]);

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
