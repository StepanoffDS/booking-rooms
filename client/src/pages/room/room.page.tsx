import { NavLink } from 'react-router-dom';
import { CalendarDays, ChevronRight, Monitor, PenLine, UsersRound, Video } from 'lucide-react';

import { ROUTES } from '@/shared/model/routes';
import { ErrorState } from '@/shared/ui/error-state';
import { Button } from '@/shared/ui/kit/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/kit/card';
import { Skeleton } from '@/shared/ui/kit/skeleton';

const amenities = [
  [UsersRound, 'Вместимость: до 12 человек'],
  [Monitor, 'Проектор и ТВ-панель 4K'],
  [PenLine, 'Маркерная доска'],
  [Video, 'Система видеоконференций'],
] as const;

const timeSlots = Array.from(
  { length: 12 },
  (_, index) => `${String(index + 9).padStart(2, '0')}:00`,
);

function RoomBreadcrumbs() {
  return (
    <nav aria-label="Хлебные крошки">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        <li>
          <NavLink to={ROUTES.ROOMS}>Переговорные</NavLink>
        </li>
        <ChevronRight aria-hidden="true" className="size-4" />
        <li>Офис Москва</li>
        <ChevronRight aria-hidden="true" className="size-4" />
        <li aria-current="page" className="font-semibold text-foreground">
          Комната «Эверест»
        </li>
      </ol>
    </nav>
  );
}

function RoomInfoCard() {
  return (
    <Card className="h-fit rounded-xl border border-border p-6 shadow-none">
      <CardHeader className="border-b border-border p-0 pb-6">
        <CardTitle className="text-3xl font-bold">Эверест</CardTitle>
        <p className="mt-2 text-sm text-muted-foreground">Офис Москва · ул. Лесная 7</p>
      </CardHeader>
      <CardContent className="p-0 pt-6">
        <dl className="space-y-4">
          {amenities.map(([Icon, title]) => (
            <div key={title} className="flex items-center gap-3 text-sm">
              <Icon aria-hidden="true" className="size-5 text-primary" strokeWidth={2} />
              <dd>{title}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

export function RoomLoadingScreen() {
  return (
    <main aria-busy="true" aria-label="Загрузка переговорной" className="flex flex-1 bg-slate-50">
      <div className="container flex w-full flex-col px-6 py-8 lg:px-10">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-32" />
          <ChevronRight aria-hidden="true" className="size-4 text-muted-foreground" />
          <Skeleton className="h-5 w-24" />
          <ChevronRight aria-hidden="true" className="size-4 text-muted-foreground" />
          <Skeleton className="h-5 w-36" />
        </div>

        <div className="mt-4 grid flex-1 gap-8 lg:grid-cols-[minmax(18rem,26rem)_minmax(0,1fr)]">
          <Card className="h-fit rounded-xl border border-border p-6 shadow-none">
            <CardHeader className="border-b border-border p-0 pb-6">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="mt-3 h-5 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-4 p-0 pt-6">
              {amenities.map(([, title]) => (
                <div key={title} className="flex items-center gap-3">
                  <Skeleton className="size-5" />
                  <Skeleton className="h-5 flex-1" />
                </div>
              ))}
            </CardContent>
          </Card>

          <section className="flex min-h-[42rem] flex-col rounded-xl border border-border bg-card p-6 lg:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-5 w-36" />
              </div>
              <Skeleton className="h-10 w-44" />
            </div>

            <ol className="mt-5 flex-1">
              {timeSlots.map((time) => (
                <li key={time} className="grid min-h-15 grid-cols-[4rem_minmax(0,1fr)]">
                  <time className="pt-1 text-sm text-muted-foreground">{time}</time>
                  <div className="border-t border-border" />
                </li>
              ))}
            </ol>

            <div className="mt-6 flex justify-end">
              <Skeleton className="h-12 w-64" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export function RoomErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <main className="flex flex-1 bg-slate-50">
      <div className="container flex w-full flex-col px-6 py-8 lg:px-10">
        <RoomBreadcrumbs />
        <div className="mt-4 grid flex-1 gap-8 lg:grid-cols-[minmax(18rem,26rem)_minmax(0,1fr)]">
          <RoomInfoCard />
          <section
            aria-labelledby="schedule-error-title"
            className="flex min-h-[36rem] rounded-xl border border-border bg-card p-6 lg:p-8"
          >
            <ErrorState
              titleId="schedule-error-title"
              title="Не удалось загрузить расписание"
              description="Произошла ошибка при загрузке расписания переговорной"
              onRetry={onRetry}
              className="flex-1"
            />
          </section>
        </div>
      </div>
    </main>
  );
}

function RoomPage() {
  return (
    <main className="flex flex-1 bg-slate-50">
      <div className="container flex w-full flex-col px-6 py-8 lg:px-10">
        <RoomBreadcrumbs />

        <div className="mt-4 flex flex-col lg:grid flex-1 gap-8 lg:grid-cols-[minmax(18rem,26rem)_minmax(0,1fr)]">
          <RoomInfoCard />

          <section
            aria-labelledby="schedule-title"
            className="flex flex-col rounded-xl border border-border bg-card p-6 lg:p-8 h-fit"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 id="schedule-title" className="text-xl font-bold">
                  Расписание на день
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">Четверг, 24 октября</p>
              </div>
              <Button variant="outline" size="lg" className="h-10 px-4 text-sm font-semibold">
                <CalendarDays aria-hidden="true" className="size-4" />
                Выбрать дату
              </Button>
            </div>

            <ol className="mt-5 flex-1">
              {timeSlots.map((time) => (
                <li key={time} className="grid min-h-15 grid-cols-[4rem_minmax(0,1fr)]">
                  <time className="pt-1 text-sm text-muted-foreground">{time}</time>
                  <div className="border-t border-border pt-1">
                    {time === '11:00' && (
                      <div className="flex h-15 items-center rounded-lg border border-primary bg-teal-100 px-4 text-sm font-semibold text-primary">
                        Daily Sync / Команда разработки
                      </div>
                    )}
                    {time === '15:00' && (
                      <div className="flex h-15 items-center rounded-lg border border-border bg-slate-100 px-4 text-sm font-semibold">
                        Занято
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex justify-end">
              <Button size="lg" className="h-12 px-6 text-sm font-bold">
                Забронировать комнату
              </Button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export const Component = RoomPage;
