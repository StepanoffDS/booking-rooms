import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/shared/api/query-client';
import { RealtimeProvider } from '@/shared/realtime';
import { Toaster } from '@/shared/ui/kit/toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <RealtimeProvider>
        <Toaster>{children}</Toaster>
      </RealtimeProvider>
    </QueryClientProvider>
  );
}
