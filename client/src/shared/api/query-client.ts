import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './instance';

const retryRequest = (failureCount: number, error: Error) => {
  if (failureCount >= 2) {
    return false;
  }

  if (error instanceof ApiError && error.status !== undefined) {
    return error.status >= 500;
  }

  return true;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: retryRequest,
    },
    mutations: {
      retry: false,
    },
  },
});
