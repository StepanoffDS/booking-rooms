import { ClockIcon } from '@/shared/assets/icons/clock';
import { WORKDAY_END_MINUTES } from '@/shared/model/booking';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/kit/select';
import { getTimeMinutes, startTimeOptions } from '../model/booking-form';
import { BookingFormField } from '../ui/booking-form-field';

type BookingStartTimeFieldProps = {
  value: string;
  durationMinutes: number;
  disabled: boolean;
  onChange: (value: string) => void;
  onDurationChange: (duration: number) => void;
};

export function BookingStartTimeField({
  value,
  durationMinutes,
  disabled,
  onChange,
  onDurationChange,
}: BookingStartTimeFieldProps) {
  return (
    <BookingFormField title="Время начала">
      <Select
        value={value}
        onValueChange={(nextValue) => {
          if (!nextValue) return;
          const maxDuration = WORKDAY_END_MINUTES - getTimeMinutes(nextValue);
          if (durationMinutes > maxDuration) onDurationChange(maxDuration);
          onChange(nextValue);
        }}
        disabled={disabled}
      >
        <SelectTrigger className="h-10 min-h-10 w-full rounded-md bg-background px-4 !text-sm [&_svg]:size-4">
          <ClockIcon aria-hidden="true" className="size-4 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {startTimeOptions.map((time) => <SelectItem key={time} value={time}>{time}</SelectItem>)}
          </SelectGroup>
        </SelectContent>
      </Select>
    </BookingFormField>
  );
}
