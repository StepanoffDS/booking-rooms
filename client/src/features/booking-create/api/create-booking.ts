import api from '@/shared/api/instance';
import type { paths } from '@/shared/api/schema/openapi';

export type CreateBookingPayload = paths['/api/v1/bookings']['post']['requestBody']['content']['application/json'];
export type CreatedBooking = paths['/api/v1/bookings']['post']['responses'][201]['content']['application/json'];

export async function createBooking(payload: CreateBookingPayload): Promise<CreatedBooking> {
  const { data } = await api.post<CreatedBooking>('/bookings', payload);
  return data;
}
