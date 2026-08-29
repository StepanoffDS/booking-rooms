import { TriangleAlertIcon } from 'lucide-react';

import { Button } from '@/shared/ui/kit/button';
import { DialogDescription, DialogTitle } from '@/shared/ui/kit/dialog';

export function BookingConflict({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="flex min-h-96 flex-col items-center justify-center text-center">
      <span className="flex size-25 items-center justify-center rounded-full bg-red-100 text-red-700">
        <TriangleAlertIcon aria-hidden="true" className="size-11" />
      </span>
      <DialogTitle className="mt-7 text-4xl font-bold">Время уже занято</DialogTitle>
      <DialogDescription className="mt-9 max-w-xl text-2xl leading-relaxed text-slate-600">
        Выбранный интервал был забронирован другим сотрудником. Расписание обновлено.
      </DialogDescription>
      <Button type="button" className="mt-9 h-17 w-full max-w-[656px] text-xl font-bold" onClick={onRetry}>
        Выбрать другое время
      </Button>
    </section>
  );
}
