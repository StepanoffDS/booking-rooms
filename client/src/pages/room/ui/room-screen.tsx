import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';

import type { RoomDetails } from '@/entities/room';
import { useCurrentUser } from '@/entities/user';
import { cn } from '@/shared/lib/css';
import { ErrorState } from '@/shared/ui/error-state';
import { Button } from '@/shared/ui/kit/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/shared/ui/kit/breadcrumb';
import { Card, CardContent, CardHeader } from '@/shared/ui/kit/card';
import { Skeleton } from '@/shared/ui/kit/skeleton';
import { RoomDatePicker } from '../compose/room-date-picker';
import { useRoomDate } from '../model/use-room-date';
import { getBookingHeight, SCHEDULE_SLOT_COUNT, type ScheduleSlot } from '../model/schedule';
import { RoomBreadcrumbs } from './room-breadcrumbs';
import { RoomInfoCard } from '../compose/room-info-card';
import { BookingDialog } from '@/features/booking-create';
import { DATE_FORMAT } from '@/shared/model/date';

type RoomScreenState = 'loading' | 'error' | 'content';

function RoomLoadingScreen() {
  return (
    <main aria-busy="true" aria-label="Загрузка переговорной" className="flex flex-1 bg-slate-50">
      <div className="container flex w-full flex-col px-6 py-8 lg:px-10">
        <Breadcrumb aria-label="Хлебные крошки">
          <BreadcrumbList className="gap-2 text-sm">
            <BreadcrumbItem>
              <Skeleton className="h-5 w-32" />
            </BreadcrumbItem>
            <BreadcrumbSeparator className="[&>svg]:size-4" />
            <BreadcrumbItem>
              <Skeleton className="h-5 w-24" />
            </BreadcrumbItem>
            <BreadcrumbSeparator className="[&>svg]:size-4" />
            <BreadcrumbItem>
              <Skeleton className="h-5 w-36" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-4 grid flex-1 gap-8 lg:grid-cols-[minmax(18rem,26rem)_minmax(0,1fr)]">
          <Card className="h-fit rounded-xl border border-border p-6 shadow-none">
            <CardHeader className="border-b border-border p-0 pb-6">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="mt-3 h-5 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-4 p-0 pt-6">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="flex items-center gap-3">
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
              {Array.from({ length: SCHEDULE_SLOT_COUNT }, (_, index) => (
                <li key={index} className="grid min-h-15 grid-cols-[4rem_minmax(0,1fr)]">
                  <Skeleton className="mt-1 h-5 w-10" />
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

function RoomErrorScreen({ onRetry, search }: { onRetry: () => void; search: string }) {
  return (
    <main className="flex flex-1 bg-slate-50">
      <div className="container flex w-full flex-col px-6 py-8 lg:px-10">
        <RoomBreadcrumbs search={search} />
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

function RoomContentScreen({
  room,
  scheduleSlots,
  search,
  roomDate,
}: {
  room: RoomDetails;
  scheduleSlots: ScheduleSlot[];
  search: string;
  roomDate: ReturnType<typeof useRoomDate>;
}) {
  const scheduleDate = format(roomDate.selectedDate, `EEEE, ${DATE_FORMAT}`, { locale: ru });
  const [isBookingDialogOpen, setBookingDialogOpen] = useState(false);
  const { data: user } = useCurrentUser();

  return (
    <main className="flex flex-1 bg-slate-50">
      <div className="container flex w-full flex-col px-6 py-8 lg:px-10">
        <RoomBreadcrumbs room={room} search={search} />

        <div className="mt-4 flex flex-1 flex-col gap-8 lg:grid lg:grid-cols-[minmax(18rem,26rem)_minmax(0,1fr)]">
          <RoomInfoCard room={room} />

          <Card
            aria-labelledby="schedule-title"
            className="flex h-fit flex-col rounded-xl bg-card p-6 lg:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 id="schedule-title" className="text-xl font-bold">
                  Расписание на день
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {scheduleDate[0].toUpperCase() + scheduleDate.slice(1)}
                </p>
              </div>
              <RoomDatePicker roomDate={roomDate} />
            </div>

            <ol className="mt-5 flex-1">
              {scheduleSlots.map((slot) => (
                <li key={slot.time} className="grid h-15 grid-cols-[4rem_minmax(0,1fr)]">
                  <time className="pt-1 text-sm text-muted-foreground">{slot.time}</time>
                  <div className="border-t border-border pt-1">
                    {slot.bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className={cn(
                          'relative z-10 flex items-center rounded-lg border px-4 text-sm font-semibold',
                          booking.userId === user?.id
                            ? 'border-teal-500 bg-teal-100 text-teal-900'
                            : 'border-border bg-slate-100',
                        )}
                        style={{ height: getBookingHeight(booking) }}
                      >
                        {booking.title}
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex justify-end">
              <Button
                disabled={!roomDate.canBook}
                size="lg"
                className="h-12 px-6 text-sm font-bold"
                onClick={() => setBookingDialogOpen(true)}
              >
                Забронировать комнату
              </Button>
            </div>
          </Card>
        </div>
      </div>
      {isBookingDialogOpen && (
        <BookingDialog
          room={room}
          date={roomDate.selectedDate}
          open
          onOpenChange={setBookingDialogOpen}
        />
      )}
    </main>
  );
}

export function getRoomScreenState({
  isLoading,
  isError,
  room,
}: {
  isLoading: boolean;
  isError: boolean;
  room?: RoomDetails;
}): RoomScreenState {
  if (isLoading) return 'loading';
  if (isError || !room) return 'error';
  return 'content';
}

export function RoomScreen({
  state,
  room,
  scheduleSlots,
  search,
  roomDate,
  onRetry,
}: {
  state: RoomScreenState;
  room?: RoomDetails;
  scheduleSlots: ScheduleSlot[];
  search: string;
  roomDate: ReturnType<typeof useRoomDate>;
  onRetry: () => void;
}) {
  switch (state) {
    case 'loading':
      return <RoomLoadingScreen />;
    case 'error':
      return <RoomErrorScreen search={search} onRetry={onRetry} />;
    case 'content':
      return (
        <RoomContentScreen
          room={room!}
          scheduleSlots={scheduleSlots}
          search={search}
          roomDate={roomDate}
        />
      );
  }
}
