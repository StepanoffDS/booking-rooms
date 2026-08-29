import type { paths } from '@/shared/api/schema/openapi';

export type RoomsQuery = paths['/api/v1/rooms']['get']['parameters']['query'];
export type RoomsResponse = paths['/api/v1/rooms']['get']['responses'][200]['content']['application/json'];
export type Room = RoomsResponse['items'][number];
export type RoomDetails = paths['/api/v1/rooms/{roomId}']['get']['responses'][200]['content']['application/json'];
export type RoomBookingsQuery = paths['/api/v1/rooms/{roomId}/bookings']['get']['parameters']['query'];
export type RoomBookingsResponse = paths['/api/v1/rooms/{roomId}/bookings']['get']['responses'][200]['content']['application/json'];
export type RoomBooking = RoomBookingsResponse['items'][number];
