import axios, { type AxiosInstance } from 'axios';
import { CONFIG } from '../model/config';

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export class ApiError extends Error {
  readonly code: string;
  readonly status?: number;
  readonly details?: Record<string, unknown>;

  constructor(message: string, code: string, status?: number, details?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (typeof value !== 'object' || value === null || !('error' in value)) {
    return false;
  }

  const error = value.error;
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string' &&
    'message' in error &&
    typeof error.message === 'string'
  );
}

function toApiError(error: unknown): unknown {
  if (axios.isCancel(error)) {
    return error;
  }

  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return error;
  }

  const status = error.response?.status;
  const response = error.response?.data;

  if (isApiErrorResponse(response)) {
    return new ApiError(
      response.error.message,
      response.error.code,
      status,
      response.error.details,
    );
  }

  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return new ApiError('Сервер не ответил вовремя', 'TIMEOUT_ERROR', status);
  }

  if (!error.response) {
    return new ApiError('Не удалось подключиться к серверу', 'NETWORK_ERROR');
  }

  return new ApiError('Не удалось выполнить запрос', 'HTTP_ERROR', status);
}

const api: AxiosInstance = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: 10_000,
  headers: { Accept: 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiError(error)),
);

export default api;
