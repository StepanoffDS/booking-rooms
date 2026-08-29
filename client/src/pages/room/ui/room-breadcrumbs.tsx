import { NavLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import type { RoomDetails } from '@/entities/room';
import { ROUTES } from '@/shared/model/routes';

export function RoomBreadcrumbs({ room, search = '' }: { room?: RoomDetails; search?: string }) {
  return (
    <nav aria-label="Хлебные крошки">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        <li>
          <NavLink to={{ pathname: ROUTES.ROOMS, search: search ? `?${search}` : '' }}>
            Переговорные
          </NavLink>
        </li>
        <ChevronRight aria-hidden="true" className="size-4" />
        <li>
          <NavLink to={{ pathname: ROUTES.ROOMS, search: search ? `?${search}` : '' }}>
            {room?.office.name ?? 'Офис'}
          </NavLink>
        </li>
        <ChevronRight aria-hidden="true" className="size-4" />
        <li aria-current="page" className="font-semibold text-foreground">
          Комната «{room?.name ?? '…'}»
        </li>
      </ol>
    </nav>
  );
}
