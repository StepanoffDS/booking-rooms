import type { paths } from '@/shared/api/schema/openapi';

export type OfficesResponse =
  paths['/api/v1/offices']['get']['responses'][200]['content']['application/json'];
export type Office = OfficesResponse['items'][number];
