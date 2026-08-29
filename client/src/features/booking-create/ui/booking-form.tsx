import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { InfoIcon } from 'lucide-react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import {
  formatDuration,
  formatTime,
  getDefaultBookingValues,
  getDurationOptions,
  getTimeMinutes,
  type BookingFormValues,
} from '../model/booking-form';
import { Alert, AlertDescription } from '@/shared/ui/kit/alert';
import { FieldError } from '@/shared/ui/kit/field';
import { Input } from '@/shared/ui/kit/input';
import { Textarea } from '@/shared/ui/kit/textarea';
import { DatePicker } from '@/shared/ui/date-picker';
import { BookingFormField } from './booking-form-field';
import { BookingFormFooter } from './booking-form-footer';
import { BookingDurationField } from '../compose/booking-duration-field';
import { BookingStartTimeField } from '../compose/booking-start-time-field';
import { DATE_FORMAT } from '@/shared/model/date';

type BookingFormProps = {
  date: Date;
  timeZone: string;
  isPending: boolean;
  submitError: Error | null;
  showDateHint: boolean;
  onSubmit: (values: BookingFormValues) => void;
};

export function BookingForm({
  date,
  timeZone,
  isPending,
  submitError,
  showDateHint,
  onSubmit,
}: BookingFormProps) {
  const form = useForm<BookingFormValues>({ defaultValues: getDefaultBookingValues(date) });
  const selectedDate = useWatch({ control: form.control, name: 'date' });
  const startTime = useWatch({ control: form.control, name: 'startTime' });
  const durationMinutes = useWatch({ control: form.control, name: 'durationMinutes' });
  const startMinutes = getTimeMinutes(startTime);
  const durationOptions = getDurationOptions(startTime);
  const endTime = formatTime(startMinutes + durationMinutes);
  const dayName = format(selectedDate, `EEEE, ${DATE_FORMAT}`, { locale: ru });

  return (
    <form className="space-y-5 pt-6" onSubmit={form.handleSubmit(onSubmit)}>
      {showDateHint && (
        <Alert className="border-0 bg-amber-100 px-5 py-4 text-amber-900">
          <InfoIcon aria-hidden="true" className="size-4 shrink-0" />
          <AlertDescription className="text-[13px] font-semibold">
            Попробуйте выбрать другую дату или время.
          </AlertDescription>
        </Alert>
      )}

      <BookingFormField title="Тема встречи *">
        <Input
          {...form.register('title', {
            validate: (value) => value.trim().length > 0 || 'Укажите тему встречи',
          })}
          disabled={isPending}
          aria-invalid={Boolean(form.formState.errors.title)}
          className="h-10 rounded-md bg-background px-4 !text-sm text-foreground focus-visible:border-primary"
        />
        <FieldError className="mt-1" errors={[form.formState.errors.title]} />
      </BookingFormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <Controller
          control={form.control}
          name="date"
          render={({ field }) => (
            <BookingFormField title="Дата">
              <DatePicker
                date={field.value}
                onDateChange={field.onChange}
                disabled={isPending}
                className="w-full"
                timeZone={timeZone}
              />
            </BookingFormField>
          )}
        />
        <Controller
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <BookingStartTimeField
              value={field.value}
              durationMinutes={durationMinutes}
              disabled={isPending}
              onChange={field.onChange}
              onDurationChange={(duration) => form.setValue('durationMinutes', duration)}
            />
          )}
        />
      </div>

      <Controller
        control={form.control}
        name="durationMinutes"
        render={({ field }) => (
          <BookingDurationField
            value={field.value}
            options={durationOptions}
            startMinutes={startMinutes}
            disabled={isPending}
            onChange={field.onChange}
          />
        )}
      />

      <BookingFormField title="Комментарий">
        <Textarea
          {...form.register('comment')}
          disabled={isPending}
          placeholder="Дополнительная информация для участников встречи..."
          className="min-h-20 rounded-md bg-background px-4 py-3 text-sm"
        />
      </BookingFormField>

      <Alert className="rounded-md border-0 bg-primary/15 px-5 py-4 text-primary">
        <InfoIcon aria-hidden="true" className="size-4 shrink-0" />
        <AlertDescription className="text-[13px] font-semibold text-primary">
          Бронирование на {dayName}, {startTime} - {endTime} ({formatDuration(durationMinutes)})
        </AlertDescription>
      </Alert>

      <BookingFormFooter isPending={isPending} submitError={submitError} />
    </form>
  );
}
