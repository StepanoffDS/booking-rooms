import { useEffect, useState } from 'react';

import {
  getBookingDateBounds,
  isBookingDateAvailable,
  parseBookingDateParam,
  toBookingDateParam,
} from '@/shared/model/booking';

const DATE_PARAM = 'date';

type SetSearchParams = (
  next: URLSearchParams | ((current: URLSearchParams) => URLSearchParams),
  options?: { replace?: boolean },
) => void;

export function useRoomDate(searchParams: URLSearchParams, setSearchParams: SetSearchParams) {
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const { minDate, maxDate } = getBookingDateBounds();
  const dateParam = searchParams.get(DATE_PARAM);
  const parsedDate = parseBookingDateParam(dateParam);
  const selectedDate = parsedDate && isBookingDateAvailable(parsedDate) ? parsedDate : minDate;
  const selectedDateParam = toBookingDateParam(selectedDate);

  useEffect(() => {
    if (dateParam === selectedDateParam) return;
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set(DATE_PARAM, selectedDateParam);
      return next;
    }, { replace: true });
  }, [dateParam, selectedDateParam, setSearchParams]);

  function selectDate(date: Date) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set(DATE_PARAM, toBookingDateParam(date));
      return next;
    });
    setDatePickerOpen(false);
  }

  return {
    selectedDate,
    minDate,
    maxDate,
    canBook: isBookingDateAvailable(selectedDate),
    isDatePickerOpen,
    setDatePickerOpen,
    selectDate,
  };
}
