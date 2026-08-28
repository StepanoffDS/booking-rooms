import { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { CalendarIcon } from '@/shared/assets/icons/calendar';
import { AttentionSignIcon } from '@/shared/assets/icons/attention-triangle-sign';
import { BuildIcon } from '@/shared/assets/icons/build';
import { ClockIcon } from '@/shared/assets/icons/clock';
import { PeopleIcon } from '@/shared/assets/icons/people';
import { SearchCrossIcon } from '@/shared/assets/icons/search-cross';
import { Button } from '@/shared/ui/kit/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/kit/card';
import { Calendar } from '@/shared/ui/kit/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/kit/popover';
import { Skeleton } from '@/shared/ui/kit/skeleton';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/kit/select';
import { TransparentSelect } from '@/shared/ui/transparent-select';
import { DATE_FORMAT } from '@/shared/model/date';

const rooms = [
  { name: 'Эверест', floor: '4 этаж', capacity: 'до 12 человек', occupied: 'Занята до 15:30' },
  { name: 'Эльбрус', floor: '4 этаж', capacity: 'до 8 человек', occupied: 'Занята до 16:00' },
  {
    name: 'Казбек',
    floor: '3 этаж',
    capacity: 'до 6 человек',
    occupied: 'Свободна весь день',
    available: true,
  },
  {
    name: 'Монблан',
    floor: '3 этаж',
    capacity: 'до 4 человек',
    occupied: 'Занята до 15:00',
    available: true,
  },
];

const initialDate = new Date(2026, 9, 24);
const timeOptions = Array.from({ length: 45 }, (_, index) => {
  const minutes = 9 * 60 + index * 15;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
});
const durationOptions = ['15 минут', '30 минут', '45 минут', '1 час', '1 час 30 минут', '2 часа'];
const capacityOptions = [
  'Мин. 1 чел.',
  'Мин. 2 чел.',
  'Мин. 4 чел.',
  'Мин. 6 чел.',
  'Мин. 8 чел.',
  'Мин. 12 чел.',
];
const officeOptions = ['Офис Москва', 'Офис Санкт-Петербург', 'Офис Екатеринбург'];

function RoomCard({ name, floor, capacity, occupied, available = false }: (typeof rooms)[number]) {
  return (
    <Card className="justify-between rounded-xl p-5 shadow-none ring-1 ring-border gap-2">
      <CardHeader className="gap-1 p-0">
        <CardTitle className="text-lg font-bold tracking-[-0.04em]">{name}</CardTitle>
        <p className="text-xs text-muted-foreground">{floor}</p>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 p-0">
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <PeopleIcon aria-hidden="true" />
          <span>Вместимость: {capacity}</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <ClockIcon aria-hidden="true" />
          <span>{occupied}</span>
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
        <Button variant="link" className="h-10 text-sm font-bold text-primary">
          Подробнее
        </Button>
        <Button disabled={!available} className="h-10 text-sm font-bold">
          Забронировать
        </Button>
      </CardFooter>
    </Card>
  );
}

function RoomCardSkeleton() {
  return (
    <Card
      aria-busy="true"
      aria-label="Загрузка переговорной"
      className="min-h-[320px] rounded-xl p-5 shadow-none ring-1 ring-border"
    >
      <CardHeader className="gap-2 p-0">
        <Skeleton className="h-9 w-[180px]" />
        <Skeleton className="h-6 w-19" />
      </CardHeader>

      <CardContent className="mt-6 flex flex-col gap-3 p-0">
        {[0, 1].map((index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-6 flex-1" />
          </div>
        ))}
        <Skeleton className="mt-3 h-13 w-full" />
      </CardContent>

      <CardFooter className="mt-auto grid grid-cols-2 gap-4 p-0 pt-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </CardFooter>
    </Card>
  );
}

function RoomsPage() {
  const [isLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [date, setDate] = useState(initialDate);
  const [office, setOffice] = useState('');
  const [startTime, setStartTime] = useState('15:00');
  const [duration, setDuration] = useState('1 час');
  const [capacity, setCapacity] = useState('Мин. 4 чел.');

  function handleResetFilters() {
    setDate(initialDate);
    setOffice(officeOptions[0]);
    setStartTime('15:00');
    setDuration('1 час');
    setCapacity('Мин. 4 чел.');
    setIsEmpty(false);
  }

  function handleRetry() {
    setIsError(false);
    setIsEmpty(false);
  }

  return (
    <main className="flex flex-1 flex-col">
      <section className="container border-b border-border py-6" aria-labelledby="office-title">
        <Select value={office} onValueChange={(value) => value && setOffice(value)}>
          <SelectTrigger
            id="office-title"
            aria-label="Офис"
            className="h-auto gap-2 border-0 bg-transparent p-0 text-lg font-bold shadow-none hover:bg-transparent"
          >
            <SelectValue placeholder="Выберите офис" />
          </SelectTrigger>
          <SelectContent align="start" className="min-w-[240px]">
            <SelectGroup>
              {officeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="mt-1 flex items-center gap-3 text-base text-muted-foreground text-[13px]">
          <span>ул. Лесная 7</span>
          <span aria-hidden="true">•</span>
          <span>Местное время: 14:35 MSK</span>
        </div>
      </section>

      <section
        className="container flex flex-wrap items-end gap-4 border-b border-border py-4"
        aria-label="Параметры поиска"
      >
        <div className="w-[170px]">
          <p className="mb-2 text-[11px] font-semibold text-muted-foreground">ДАТА</p>
          <Popover>
            <PopoverTrigger
              type="button"
              aria-label="Дата"
              className="flex h-9 w-full items-center gap-2 rounded-md border border-border bg-transparent px-3 text-sm font-medium shadow-none outline-none transition-colors hover:bg-slate-50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <CalendarIcon className="size-4" aria-hidden="true" />
              <span>
                {format(date, DATE_FORMAT, { locale: ru }).replace(
                  /(^\d+\s|,\s)(\p{L})/gu,
                  (_, prefix, letter) => `${prefix}${letter.toUpperCase()}`,
                )}
              </span>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => selectedDate && setDate(selectedDate)}
                locale={ru}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="w-[110px]">
          <p className="mb-2 text-[11px] font-semibold text-muted-foreground">ВРЕМЯ НАЧАЛА</p>
          <TransparentSelect
            label="Время начала"
            value={startTime}
            options={timeOptions}
            prefix={<ClockIcon className="size-4" aria-hidden="true" />}
            onValueChange={(value) => value && setStartTime(value)}
          />
        </div>

        <div className="w-[84px]">
          <p className="mb-2 text-[11px] font-semibold text-muted-foreground">ДЛИТЕЛЬНОСТЬ</p>
          <TransparentSelect
            label="Длительность"
            value={duration}
            options={durationOptions}
            onValueChange={(value) => value && setDuration(value)}
          />
        </div>

        <div className="w-[150px]">
          <p className="mb-2 text-[11px] font-semibold text-muted-foreground">ВМЕСТИМОСТЬ</p>
          <TransparentSelect
            label="Вместимость"
            value={capacity}
            options={capacityOptions}
            prefix={<PeopleIcon className="size-4" aria-hidden="true" />}
            onValueChange={(value) => value && setCapacity(value)}
          />
        </div>
      </section>

      <section className="container flex flex-1 flex-col bg-slate-50 px-6 py-10" aria-labelledby="rooms-title">
        {isLoading ? (
          <>
            <h1 id="rooms-title" className="mb-9 text-2xl font-bold">
              Загрузка переговорных...
            </h1>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {rooms.map((room) => <RoomCardSkeleton key={room.name} />)}
            </div>
          </>
        ) : isError ? (
          <div className="flex flex-1 flex-col items-center justify-center pb-24 text-center">
            <div className="flex size-36 items-center justify-center rounded-full bg-red-100">
              <AttentionSignIcon aria-hidden="true" className="size-14" />
            </div>
            <h1 id="rooms-title" className="mt-9 text-4xl font-bold tracking-[-0.04em]">
              Не удалось загрузить данные
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">Произошла ошибка при загрузке списка переговорных</p>
            <Button className="mt-7 h-13 rounded-lg px-6 text-base font-bold" onClick={handleRetry}>
              Попробовать снова
            </Button>
          </div>
        ) : !office ? (
          <div className="flex flex-1 flex-col items-center justify-center pb-24 text-center">
            <div className="flex size-36 items-center justify-center rounded-full bg-teal-100">
              <BuildIcon aria-hidden="true" className="size-14" />
            </div>
            <h1 id="rooms-title" className="mt-9 text-4xl font-bold tracking-[-0.04em]">
              Выберите офис
            </h1>
            <p className="mt-3 max-w-xl text-xl text-muted-foreground">
              Для просмотра доступных переговорных сначала выберите офис из списка выше
            </p>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center pb-24 text-center">
            <div className="flex size-36 items-center justify-center rounded-full bg-slate-200">
              <SearchCrossIcon aria-hidden="true" className="size-14" />
            </div>
            <h1 id="rooms-title" className="mt-9 text-4xl font-bold tracking-[-0.04em]">
              Нет доступных переговорных
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              Попробуйте изменить параметры фильтрации или выбрать другой офис
            </p>
            <Button className="mt-7 h-13 rounded-lg px-6 text-base font-bold" onClick={handleResetFilters}>
              Сбросить фильтры
            </Button>
          </div>
        ) : (
          <>
            <h1 id="rooms-title" className="mb-9 text-2xl font-bold">
              Доступные переговорные в этом офисе
            </h1>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {rooms.map((room) => <RoomCard key={room.name} {...room} />)}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export const Component = RoomsPage;
