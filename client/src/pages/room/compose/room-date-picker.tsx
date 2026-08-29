import { ru } from 'date-fns/locale';

import { CalendarIcon } from '@/shared/assets/icons/calendar';
import { Calendar } from '@/shared/ui/kit/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/kit/popover';
import { type useRoomDate } from '../model/use-room-date';

type RoomDatePickerProps = {
  roomDate: ReturnType<typeof useRoomDate>;
};

export function RoomDatePicker({ roomDate }: RoomDatePickerProps) {
  return (
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
          onSelect={(date) => date && roomDate.selectDate(date)}
          locale={ru}
        />
      </PopoverContent>
    </Popover>
  );
}
