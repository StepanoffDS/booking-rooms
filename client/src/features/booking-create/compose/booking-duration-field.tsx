import { formatDurationOption } from '../model/booking-form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/kit/select';
import { BookingFormField } from '../ui/booking-form-field';

type BookingDurationFieldProps = {
  value: number;
  options: number[];
  startMinutes: number;
  disabled: boolean;
  onChange: (duration: number) => void;
};

export function BookingDurationField({
  value,
  options,
  startMinutes,
  disabled,
  onChange,
}: BookingDurationFieldProps) {
  return (
    <BookingFormField title="Продолжительность">
      <Select value={String(value)} onValueChange={(duration) => duration && onChange(Number(duration))} disabled={disabled}>
        <SelectTrigger className="h-10 min-h-10 w-full rounded-md bg-background px-4 !text-sm [&_svg]:size-4">
          <SelectValue>{formatDurationOption(value, startMinutes)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((duration) => (
              <SelectItem key={duration} value={String(duration)}>
                {formatDurationOption(duration, startMinutes)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </BookingFormField>
  );
}
