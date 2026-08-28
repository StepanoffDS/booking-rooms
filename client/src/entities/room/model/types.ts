import type { paths } from '@/shared/api/schema/openapi';

export type RoomsQuery = paths['/api/v1/rooms']['get']['parameters']['query'];
export type RoomsResponse = paths['/api/v1/rooms']['get']['responses'][200]['content']['application/json'];
export type Room = RoomsResponse['items'][number];
