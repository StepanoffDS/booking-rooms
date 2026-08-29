import { LoaderCircleIcon } from 'lucide-react';

import { ApiError } from '@/shared/api/instance';
import { Button } from '@/shared/ui/kit/button';
import { DialogClose } from '@/shared/ui/kit/dialog';

type BookingFormFooterProps = {
  isPending: boolean;
  submitError: Error | null;
};

export function BookingFormFooter({ isPending, submitError }: BookingFormFooterProps) {
  return (
    <>
      {submitError &&
        !(submitError instanceof ApiError && submitError.code === 'BOOKING_CONFLICT') && (
          <p role="alert" className="text-sm text-destructive">
            {submitError.message || 'Не удалось создать бронирование'}
          </p>
        )}

      <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
        <DialogClose
          render={
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              className="h-12 px-7 text-base font-bold"
            />
          }
        >
          Отмена
        </DialogClose>
        <Button type="submit" disabled={isPending} className="h-12 px-7 text-base font-bold">
          {isPending && <LoaderCircleIcon aria-hidden="true" className="size-4 animate-spin" />}
          {isPending ? 'Создаём бронирование...' : 'Забронировать'}
        </Button>
      </div>
    </>
  );
}
