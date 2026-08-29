import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { queryClient } from '@/shared/api/query-client';
import { CONFIG } from '@/shared/model/config';

export type RealtimeStatus = 'connecting' | 'connected' | 'reconnecting';

const RealtimeContext = createContext<RealtimeStatus>('connecting');
const RECONNECT_MAX_DELAY_MS = 10_000;
const RESYNC_DEBOUNCE_MS = 150;

function getWebSocketUrl() {
  const url = new URL(`${CONFIG.API_BASE_URL.replace(/\/$/, '')}/ws`);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  return url.toString();
}

function resync() {
  // ponytail: resync all active data; target event-specific caches if the dataset grows.
  void queryClient.invalidateQueries({ queryKey: ['rooms'] });
  void queryClient.invalidateQueries({ queryKey: ['bookings'] });
}

function isRealtimeEvent(value: unknown): boolean {
  return typeof value === 'object' && value !== null && 'type' in value && typeof value.type === 'string';
}

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<RealtimeStatus>('connecting');

  useEffect(() => {
    let stopped = false;
    let reconnectAttempts = 0;
    let socket: WebSocket | undefined;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let resyncTimer: ReturnType<typeof setTimeout> | undefined;

    const scheduleResync = () => {
      clearTimeout(resyncTimer);
      resyncTimer = setTimeout(resync, RESYNC_DEBOUNCE_MS);
    };

    const connect = () => {
      if (stopped) return;

      setStatus(reconnectAttempts === 0 ? 'connecting' : 'reconnecting');

      try {
        socket = new WebSocket(getWebSocketUrl());
      } catch {
        reconnect();
        return;
      }

      socket.onopen = () => {
        reconnectAttempts = 0;
        setStatus('connected');
        resync();
      };
      socket.onmessage = (event) => {
        try {
          if (isRealtimeEvent(JSON.parse(event.data))) scheduleResync();
        } catch {
          // Ignore malformed messages and keep the connection alive.
        }
      };
      socket.onclose = reconnect;
    };

    const reconnect = () => {
      if (stopped) return;

      const delay = Math.min(1_000 * 2 ** reconnectAttempts, RECONNECT_MAX_DELAY_MS);
      reconnectAttempts += 1;
      setStatus('reconnecting');
      reconnectTimer = setTimeout(connect, delay);
    };

    connect();

    return () => {
      stopped = true;
      clearTimeout(reconnectTimer);
      clearTimeout(resyncTimer);
      socket?.close();
    };
  }, []);

  return <RealtimeContext value={status}>{children}</RealtimeContext>;
}

export function useRealtimeStatus() {
  return useContext(RealtimeContext);
}
