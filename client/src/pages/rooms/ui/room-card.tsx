import type { Room } from '@/entities/room';
import { href, Link } from 'react-router-dom';
import { PeopleIcon } from '@/shared/assets/icons/people';
import { ROUTES } from '@/shared/model/routes';
import { Button } from '@/shared/ui/kit/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/kit/card';

export function RoomCard({
  id,
  name,
  floor,
  capacity,
  available = false,
  search,
}: Room & { search: string }) {
  return (
    <Card className="justify-between rounded-xl p-5 shadow-none ring-1 ring-border gap-2">
      <CardHeader className="gap-1 p-0">
        <CardTitle className="text-lg font-bold tracking-[-0.04em]">{name}</CardTitle>
        <p className="text-xs text-muted-foreground">{floor} этаж</p>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 p-0">
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <PeopleIcon aria-hidden="true" className="text-foreground" />
          <span>Вместимость: до {capacity} человек</span>
        </div>
        <div
          className={`flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold ${
            available ? 'bg-teal-100 text-primary' : 'bg-slate-200 text-slate-500'
          }`}
        >
          <span className={`size-2 rounded-full ${available ? 'bg-primary' : 'bg-slate-400'}`} />
          <span>{available ? 'Доступно на выбранное время' : 'Недоступно на выбранное время'}</span>
        </div>
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-4 p-0 pt-2.5 mt-auto">
        <Link
          to={{
            pathname: href(ROUTES.ROOM, { roomId: id }),
            search: search ? `?${search}` : '',
          }}
          className="flex h-10 items-center justify-center text-sm font-bold text-primary hover:underline"
        >
          Подробнее
        </Link>
        <Button disabled={!available} className="h-10 text-sm font-bold">
          Забронировать
        </Button>
      </CardFooter>
    </Card>
  );
}
