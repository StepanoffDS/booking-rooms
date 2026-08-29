import type { paths } from '@/shared/api/schema/openapi';

export type CurrentUser = paths['/api/v1/me']['get']['responses'][200]['content']['application/json'];
