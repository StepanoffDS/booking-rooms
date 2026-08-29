import { useQuery } from '@tanstack/react-query';

import api from '@/shared/api/instance';
import type {
  RoomBookingsQuery,
  RoomBookingsResponse,
  RoomDetails,
  RoomsQuery,
  RoomsResponse,
} from '../model/types';

async function getRooms(params: RoomsQuery): Promise<RoomsResponse> {
  const { data } = await api.get<RoomsResponse>('/rooms', { params });
  return data;
}

async function getRoom(roomId: string): Promise<RoomDetails> {
  const { data } = await api.get<RoomDetails>(`/rooms/${roomId}`);
  return data;
}

async function getRoomBookings(
  roomId: string,
  params: RoomBookingsQuery,
): Promise<RoomBookingsResponse> {
  const { data } = await api.get<RoomBookingsResponse>(`/rooms/${roomId}/bookings`, { params });
  return data;
}

export function useRooms(params?: RoomsQuery) {
  return useQuery({
    queryKey: ['rooms', params],
    queryFn: () => getRooms(params!),
    enabled: params !== undefined,
  });
}

export function useRoom(roomId?: string) {
  return useQuery({
    queryKey: ['rooms', roomId],
    queryFn: () => getRoom(roomId!),
    enabled: Boolean(roomId),
  });
}

export function useRoomBookings(roomId?: string, params?: RoomBookingsQuery) {
  return useQuery({
    queryKey: ['rooms', roomId, 'bookings', params],
    queryFn: () => getRoomBookings(roomId!, params!),
    enabled: Boolean(roomId && params),
  });
}
