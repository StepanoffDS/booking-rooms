import type { CurrentUser } from './types';

const STORAGE_KEY = 'booking-rooms:current-user';

function isCurrentUserValid(value: unknown): value is CurrentUser {
  if (typeof value !== 'object' || value === null) return false;

  const user = value as Record<string, unknown>;
  return (
    typeof user.id === 'string' &&
    typeof user.login === 'string' &&
    typeof user.displayName === 'string' &&
    typeof user.email === 'string' &&
    (typeof user.avatarUrl === 'string' || user.avatarUrl === null) &&
    typeof user.initials === 'string'
  );
}

export function getStoredCurrentUser(): CurrentUser | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    return isCurrentUserValid(value) ? value : null;
  } catch {
    return null;
  }
}

export function storeCurrentUser(user: CurrentUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}
