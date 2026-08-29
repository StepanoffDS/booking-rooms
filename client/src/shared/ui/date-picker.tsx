import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { CalendarIcon } from '@/shared/assets/icons/calendar';
import { cn } from '@/shared/lib/css';
import { DATE_FORMAT_WEEKDAY } from '@/shared/model/date';
import { getBookingDateBounds, toBookingDate } from '@/shared/model/booking';
import { Calendar } from '@/shared/ui/kit/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/kit/popover';

export function DatePicker({
  date,
  onDateChange,
  disabled = false,
  className,
  timeZone,
}: {
  date: Date;
  onDateChange: (date: Date) => void;
  disabled?: boolean;
  className?: string;
  timeZone: string;
}) {
  const { minDate, maxDate } = getBookingDateBounds(timeZone);

  return (
    <Popover>
      <PopoverTrigger
        type="button"
        aria-label="Дата"
        disabled={disabled}
        className={cn(
          'flex h-9 w-full items-center gap-2 rounded-md border border-border bg-transparent px-3 text-sm font-medium shadow-none outline-none transition-colors hover:bg-slate-50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      >
        <CalendarIcon className="size-4" aria-hidden="true" />
        <span>{format(date, DATE_FORMAT_WEEKDAY, { locale: ru })}</span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          disabled={[{ before: minDate }, { after: maxDate }]}
          onSelect={(nextDate) => nextDate && onDateChange(toBookingDate(nextDate, timeZone))}
          locale={ru}
        />
      </PopoverContent>
    </Popover>
  );
}
