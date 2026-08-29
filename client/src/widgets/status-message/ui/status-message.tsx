import { useRealtimeStatus } from '@/shared/realtime';
import { InfoIcon } from 'lucide-react';

const connectionStatus = {
  connecting: 'Подключение к серверу…',
  reconnecting: 'Соединение потеряно. Переподключение…',
} as const;

export function StatusMessage() {
  const status = useRealtimeStatus();
  const statusMessage = status === 'connected' ? undefined : connectionStatus[status];

  return (
    <>
      {statusMessage && (
        <div className="container pt-5">
          <p
            className="flex h-11 items-center justify-center gap-2 bg-[#fff08c] px-4 text-sm font-medium text-[#855715]"
            role="status"
            aria-live="polite"
          >
            <InfoIcon aria-hidden="true" className="size-5 shrink-0" />
            {statusMessage}
          </p>
        </div>
      )}
    </>
  );
}
