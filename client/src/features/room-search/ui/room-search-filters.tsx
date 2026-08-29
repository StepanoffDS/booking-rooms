import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import {
  getStartTimeOptions,
  type RoomFilters,
} from '../model/room-filters';
import { CalendarIcon } from '@/shared/assets/icons/calendar';
import { ClockIcon } from '@/shared/assets/icons/clock';
import { PeopleIcon } from '@/shared/assets/icons/people';
import { DATE_FORMAT } from '@/shared/model/date';
import { getBookingDateBounds } from '@/shared/model/booking';
import { Calendar } from '@/shared/ui/kit/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/kit/popover';
import { TransparentSelect } from '@/shared/ui/transparent-select';

const durationOptions: Record<string, number> = {
  '15 минут': 15,
  '30 минут': 30,
  '45 минут': 45,
  '1 час': 60,
  '1 час 30 минут': 90,
  '2 часа': 120,
};
const capacityOptions: Record<string, number> = {
  'Мин. 1 чел.': 1,
  'Мин. 2 чел.': 2,
  'Мин. 4 чел.': 4,
  'Мин. 6 чел.': 6,
  'Мин. 8 чел.': 8,
  'Мин. 12 чел.': 12,
};

function getOptionLabel(options: Record<string, number>, value: number) {
  return Object.entries(options).find(([, optionValue]) => optionValue === value)?.[0] ?? '';
}

export function RoomSearchFilters({
  filters,
  onChange,
  disabled = false,
}: {
  filters: RoomFilters;
  onChange: (changes: Partial<RoomFilters>) => void;
  disabled?: boolean;
}) {
  const { minDate, maxDate } = getBookingDateBounds();

  return (
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
            disabled={disabled}
            className="flex h-9 w-full items-center gap-2 rounded-md border border-border bg-transparent px-3 text-sm font-medium shadow-none outline-none transition-colors hover:bg-slate-50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CalendarIcon className="size-4" aria-hidden="true" />
            <span>{format(filters.date, DATE_FORMAT, { locale: ru })}</span>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.date}
              disabled={[{ before: minDate }, { after: maxDate }]}
              onSelect={(date) => date && onChange({ date })}
              locale={ru}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="w-[110px]">
        <p className="mb-2 text-[11px] font-semibold text-muted-foreground">ВРЕМЯ НАЧАЛА</p>
        <TransparentSelect
          label="Время начала"
          value={filters.startTime}
          options={getStartTimeOptions(filters.durationMinutes)}
          prefix={<ClockIcon className="size-4" aria-hidden="true" />}
          onValueChange={(startTime) => startTime && onChange({ startTime })}
          disabled={disabled}
        />
      </div>

      <div className="w-[84px]">
        <p className="mb-2 text-[11px] font-semibold text-muted-foreground">ДЛИТЕЛЬНОСТЬ</p>
        <TransparentSelect
          label="Длительность"
          value={getOptionLabel(durationOptions, filters.durationMinutes)}
          options={Object.keys(durationOptions)}
          onValueChange={(duration) =>
            duration && onChange({ durationMinutes: durationOptions[duration] })
          }
          disabled={disabled}
        />
      </div>

      <div className="w-[150px]">
        <p className="mb-2 text-[11px] font-semibold text-muted-foreground">ВМЕСТИМОСТЬ</p>
        <TransparentSelect
          label="Вместимость"
          value={getOptionLabel(capacityOptions, filters.minCapacity)}
          options={Object.keys(capacityOptions)}
          prefix={<PeopleIcon className="size-4" aria-hidden="true" />}
          onValueChange={(capacity) =>
            capacity && onChange({ minCapacity: capacityOptions[capacity] })
          }
          disabled={disabled}
        />
      </div>
    </section>
  );
}
