import { NavLink } from 'react-router-dom';

import type { RoomDetails } from '@/entities/room';
import { ROUTES } from '@/shared/model/routes';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/kit/breadcrumb';

export function RoomBreadcrumbs({ room, search = '' }: { room?: RoomDetails; search?: string }) {
  return (
    <Breadcrumb aria-label="Хлебные крошки">
      <BreadcrumbList className="gap-2 text-sm">
        <BreadcrumbItem>
          <BreadcrumbLink render={<NavLink to={{ pathname: ROUTES.ROOMS, search: search ? `?${search}` : '' }} />}>
            Переговорные
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="[&>svg]:size-4" />
        <BreadcrumbItem>
          <BreadcrumbLink render={<NavLink to={{ pathname: ROUTES.ROOMS, search: search ? `?${search}` : '' }} />}>
            {room?.office.name ?? 'Офис'}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="[&>svg]:size-4" />
        <BreadcrumbItem>
          <BreadcrumbPage className="font-semibold">Комната «{room?.name ?? '…'}»</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
