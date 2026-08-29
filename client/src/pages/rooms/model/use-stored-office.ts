import { useEffect } from 'react';

import type { Office } from '@/entities/office';

const SELECTED_OFFICE_STORAGE_KEY = 'booking-rooms:selected-office';

type SetSearchParams = (
  next: string | URLSearchParams | ((current: URLSearchParams) => URLSearchParams),
  options?: { replace?: boolean },
) => void;

export function useStoredOffice(
  searchParams: URLSearchParams,
  setSearchParams: SetSearchParams,
  offices?: Office[],
) {
  useEffect(() => {
    if (searchParams.has('office') || !offices) return;

    const officeId = localStorage.getItem(SELECTED_OFFICE_STORAGE_KEY);
    if (officeId && offices.some((office) => office.id === officeId)) {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          next.set('office', officeId);
          return next;
        },
        { replace: true },
      );
    }
  }, [offices, searchParams, setSearchParams]);
}

export function storeSelectedOffice(officeId: string) {
  localStorage.setItem(SELECTED_OFFICE_STORAGE_KEY, officeId);
}
