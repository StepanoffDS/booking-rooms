import type { Room } from '@/entities/room';
import { BuildIcon } from '@/shared/assets/icons/build';
import { SearchCrossIcon } from '@/shared/assets/icons/search-cross';
import { ErrorState } from '@/shared/ui/error-state';
import { Button } from '@/shared/ui/kit/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/kit/card';
import { Skeleton } from '@/shared/ui/kit/skeleton';
import { RoomCard } from './room-card';

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

function RoomsLoadingScreen() {
  return (
    <>
      <h1 id="rooms-title" className="mb-9 text-2xl font-bold">
        Загрузка переговорных...
      </h1>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 4 }, (_, index) => (
          <RoomCardSkeleton key={index} />
        ))}
      </div>
    </>
  );
}

function RoomsErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorState
      titleId="rooms-title"
      title="Не удалось загрузить данные"
      description="Произошла ошибка при загрузке списка переговорных"
      onRetry={onRetry}
      className="flex-1 pb-24"
    />
  );
}

function SelectOfficeScreen() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center pb-24 text-center">
      <div className="flex size-36 items-center justify-center rounded-full bg-teal-100">
        <BuildIcon aria-hidden="true" className="size-14" />
      </div>
      <h1 id="rooms-title" className="mt-9 text-4xl font-bold">
        Выберите офис
      </h1>
      <p className="mt-3 max-w-xl text-xl text-muted-foreground">
        Для просмотра доступных переговорных сначала выберите офис из списка выше
      </p>
    </div>
  );
}

function EmptyRoomsScreen({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center pb-24 text-center">
      <div className="flex size-36 items-center justify-center rounded-full bg-slate-200">
        <SearchCrossIcon aria-hidden="true" className="size-14" />
      </div>
      <h1 id="rooms-title" className="mt-9 text-4xl font-bold">
        Нет доступных переговорных
      </h1>
      <p className="mt-3 text-xl text-muted-foreground">
        Попробуйте изменить параметры фильтрации или выбрать другой офис
      </p>
      <Button className="mt-7 h-13 rounded-lg px-6 text-base font-bold" onClick={onReset}>
        Сбросить фильтры
      </Button>
    </div>
  );
}

function RoomsListScreen({ rooms, search }: { rooms: Room[]; search: string }) {
  return (
    <>
      <h1 id="rooms-title" className="mb-9 text-2xl font-bold">
        Доступные переговорные в этом офисе
      </h1>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {rooms.map((room) => (
          <RoomCard key={room.id} {...room} search={search} />
        ))}
      </div>
    </>
  );
}

type RoomsScreenState = 'loading' | 'error' | 'select-office' | 'empty' | 'content';

export function getRoomsScreenState({
  isLoading,
  isError,
  office,
  rooms,
}: {
  isLoading: boolean;
  isError: boolean;
  office: string;
  rooms?: Room[];
}): RoomsScreenState {
  if (isLoading) return 'loading';
  if (isError) return 'error';
  if (!office) return 'select-office';
  if (!rooms?.length) return 'empty';
  return 'content';
}

export function RoomsScreen({
  state,
  rooms,
  search = '',
  onRetry,
  onReset,
}: {
  state: RoomsScreenState;
  rooms: Room[];
  search?: string;
  onRetry: () => void;
  onReset: () => void;
}) {
  switch (state) {
    case 'loading':
      return <RoomsLoadingScreen />;
    case 'error':
      return <RoomsErrorScreen onRetry={onRetry} />;
    case 'select-office':
      return <SelectOfficeScreen />;
    case 'empty':
      return <EmptyRoomsScreen onReset={onReset} />;
    case 'content':
      return <RoomsListScreen rooms={rooms} search={search} />;
  }
}
