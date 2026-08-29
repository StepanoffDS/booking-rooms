import type { paths } from '@/shared/api/schema/openapi';

export type BookingsQuery = NonNullable<paths['/api/v1/bookings']['get']['parameters']['query']>;
export type BookingsResponse = paths['/api/v1/bookings']['get']['responses'][200]['content']['application/json'];
export type Booking = BookingsResponse['items'][number];
