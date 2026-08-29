import { TZDate } from '@date-fns/tz';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { LoaderCircleIcon } from 'lucide-react';

import type { Booking } from '@/entities/booking';
import { CalendarIcon } from '@/shared/assets/icons/calendar';
import { DoorsIcon } from '@/shared/assets/icons/doors';
import { Button } from '@/shared/ui/kit/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/kit/dialog';
import { toast } from '@/shared/ui/kit/toast';
import { useCancelBooking } from '../model/use-cancel-booking';

function getBookingDate(booking: Booking) {
  return new TZDate(booking.startsAt, booking.office.timezone);
}

export function CancelBookingDialog({
  booking,
  onOpenChange,
}: {
  booking: Booking | null;
  onOpenChange: (open: boolean) => void;
}) {
  const cancelBooking = useCancelBooking();
  const date = booking && getBookingDate(booking);

  async function handleCancel() {
    if (!booking) return;
    try {
      await cancelBooking.mutateAsync(booking.id);
      toast.add({ type: 'success', title: 'Бронирование отменено' });
      onOpenChange(false);
    } catch (error) {
      toast.add({
        type: 'error',
        title: error instanceof Error ? error.message : 'Не удалось отменить бронирование',
      });
      onOpenChange(false);
    }
  }

  return (
    <Dialog
      open={Boolean(booking)}
      onOpenChange={(open) => !cancelBooking.isPending && onOpenChange(open)}
    >
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-2rem)] max-w-[630px] gap-0 rounded-3xl bg-background p-8 text-foreground shadow-2xl sm:max-w-[630px]"
      >
        <DialogHeader className="gap-3">
          <DialogTitle className="text-2xl font-bold">Отменить бронирование?</DialogTitle>
          <DialogDescription className="text-base leading-6 text-muted-foreground">
            Это действие нельзя будет отменить. Освободившееся время станет доступно другим
            сотрудникам.
          </DialogDescription>
        </DialogHeader>
        {booking && date && (
          <div className="mt-8 rounded-xl bg-slate-50 p-5">
            <p className="text-lg font-bold">{booking.title}</p>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <DoorsIcon aria-hidden="true" />
              Комната «{booking.room.name}», {booking.room.floor} этаж
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon aria-hidden="true" />
              {format(date, 'EEEE, d MMMM, HH:mm', { locale: ru })} –{' '}
              {format(new TZDate(booking.endsAt, booking.office.timezone), 'HH:mm')}
            </p>
          </div>
        )}
        <DialogFooter className="mt-8 grid grid-cols-2 gap-4 sm:flex-none sm:flex-row sm:justify-stretch">
          <DialogClose
            render={
              <Button
                variant="outline"
                disabled={cancelBooking.isPending}
                className="h-12 w-full text-base font-bold"
              />
            }
          >
            Нет, оставить
          </DialogClose>
          <Button
            disabled={cancelBooking.isPending}
            className="h-12 w-full bg-red-500 text-base font-bold hover:bg-red-600"
            onClick={handleCancel}
          >
            {cancelBooking.isPending && (
              <LoaderCircleIcon aria-hidden="true" className="size-4 animate-spin" />
            )}
            Да, отменить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
