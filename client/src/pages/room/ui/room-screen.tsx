import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronRight } from 'lucide-react';

import type { RoomDetails } from '@/entities/room';
import { CalendarIcon } from '@/shared/assets/icons/calendar';
import { ErrorState } from '@/shared/ui/error-state';
import { Button } from '@/shared/ui/kit/button';
import { Calendar } from '@/shared/ui/kit/calendar';
import { Card, CardContent, CardHeader } from '@/shared/ui/kit/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/kit/popover';
import { Skeleton } from '@/shared/ui/kit/skeleton';
import { useRoomDate } from '../model/use-room-date';
import { SCHEDULE_SLOT_COUNT, type ScheduleSlot } from '../model/schedule';
import { RoomBreadcrumbs } from './room-breadcrumbs';
import { RoomInfoCard } from './room-info-card';

type RoomScreenState = 'loading' | 'error' | 'content';

function RoomLoadingScreen() {
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
  const scheduleDate = format(roomDate.selectedDate, 'EEEE, d MMMM', { locale: ru });

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
              <Popover open={roomDate.isDatePickerOpen} onOpenChange={roomDate.setDatePickerOpen}>
                <PopoverTrigger
                  type="button"
                  className="inline-flex h-10 items-center justify-center gap-1 rounded-md border border-border px-4 text-sm font-semibold transition-colors hover:bg-input/50"
                >
                  <CalendarIcon aria-hidden="true" className="size-4" />
                  Выбрать дату
                </PopoverTrigger>
                <PopoverContent align="end" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={roomDate.selectedDate}
                    disabled={[{ before: roomDate.minDate }, { after: roomDate.maxDate }]}
                    onSelect={(date) => {
                      if (!date) return;
                      roomDate.selectDate(date);
                    }}
                    locale={ru}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <ol className="mt-5 flex-1">
              {scheduleSlots.map((slot) => (
                <li key={slot.time} className="grid min-h-15 grid-cols-[4rem_minmax(0,1fr)]">
                  <time className="pt-1 text-sm text-muted-foreground">{slot.time}</time>
                  <div className="border-t border-border pt-1">
                    {slot.bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex h-15 items-center rounded-lg border border-border bg-slate-100 px-4 text-sm font-semibold"
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
              >
                Забронировать комнату
              </Button>
            </div>
          </Card>
        </div>
      </div>
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
