import { useState } from 'react';

import type { BookingFormValues } from '../model/booking-form';
import { useCreateBooking } from '../model/use-create-booking';
import type { RoomDetails } from '@/entities/room';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/kit/dialog';
import { BookingConflict } from './booking-conflict';
import { BookingForm } from './booking-form';

type BookingDialogProps = {
  room: RoomDetails;
  date: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type BookingDialogState = 'form' | 'conflict';

type BookingDialogContentProps = {
  state: BookingDialogState;
  room: RoomDetails;
  date: Date;
  isPending: boolean;
  submitError: Error | null;
  showDateHint: boolean;
  onSubmit: (values: BookingFormValues) => void;
  onConflictRetry: () => void;
};

function BookingFormScreen({
  room,
  date,
  isPending,
  submitError,
  showDateHint,
  onSubmit,
}: Omit<BookingDialogContentProps, 'state' | 'onConflictRetry'>) {
  return (
    <>
      <DialogHeader className="gap-3 border-b border-border pb-6">
        <DialogTitle className="text-2xl font-bold">Новое бронирование</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          Переговорная: <span className="font-bold text-primary">{room.name}</span> (
          {room.office.name}, {room.floor} этаж)
        </DialogDescription>
      </DialogHeader>
      <BookingForm
        date={date}
        isPending={isPending}
        submitError={submitError}
        showDateHint={showDateHint}
        onSubmit={onSubmit}
      />
    </>
  );
}

function BookingDialogContent({ state, onConflictRetry, ...props }: BookingDialogContentProps) {
  switch (state) {
    case 'form':
      return <BookingFormScreen {...props} />;
    case 'conflict':
      return <BookingConflict onRetry={onConflictRetry} />;
  }
}

export function BookingDialog({ room, date, open, onOpenChange }: BookingDialogProps) {
  const [screen, setScreen] = useState<BookingDialogState>('form');
  const [showDateHint, setShowDateHint] = useState(false);
  const createBooking = useCreateBooking({
    room,
    onSuccess: () => onOpenChange(false),
    onConflict: () => setScreen('conflict'),
  });

  function retryAfterConflict() {
    setScreen('form');
    setShowDateHint(true);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => !createBooking.isPending && onOpenChange(nextOpen)}
    >
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[560px] gap-0 overflow-y-auto rounded-3xl bg-background p-8 text-foreground shadow-2xl sm:max-w-[560px]"
      >
        <BookingDialogContent
          state={screen}
          room={room}
          date={date}
          isPending={createBooking.isPending}
          submitError={createBooking.error}
          showDateHint={showDateHint}
          onSubmit={createBooking.mutate}
          onConflictRetry={retryAfterConflict}
        />
      </DialogContent>
    </Dialog>
  );
}
