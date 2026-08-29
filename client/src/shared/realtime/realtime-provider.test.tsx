import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/model/config', () => ({ CONFIG: { API_BASE_URL: 'http://localhost:3000/api/v1' } }));

import { queryClient } from '@/shared/api/query-client';
import { RealtimeProvider, useRealtimeStatus } from './realtime-provider';

class MockWebSocket {
  static instances: MockWebSocket[] = [];

  url: string;
  onopen: (() => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onclose: (() => void) | null = null;
  close = vi.fn();

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }
}

function Status() {
  return <output>{useRealtimeStatus()}</output>;
}

describe('RealtimeProvider', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    MockWebSocket.instances = [];
    vi.restoreAllMocks();
  });

  it('resyncs active room and booking queries after a valid realtime event', () => {
    vi.useFakeTimers();
    vi.stubGlobal('WebSocket', MockWebSocket);
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
    render(<RealtimeProvider><Status /></RealtimeProvider>);
    const socket = MockWebSocket.instances[0];

    act(() => socket.onopen?.());
    expect(screen.getByText('connected')).toBeInTheDocument();
    invalidateQueries.mockClear();

    act(() => socket.onmessage?.(new MessageEvent('message', { data: '{"type":"booking.created"}' })));
    expect(invalidateQueries).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(150));
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['rooms'] });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['bookings'] });
  });

  it('ignores malformed realtime messages', () => {
    vi.useFakeTimers();
    vi.stubGlobal('WebSocket', MockWebSocket);
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
    render(<RealtimeProvider><Status /></RealtimeProvider>);

    act(() => MockWebSocket.instances[0].onmessage?.(new MessageEvent('message', { data: 'not json' })));
    act(() => vi.advanceTimersByTime(150));

    expect(invalidateQueries).not.toHaveBeenCalled();
  });
});
