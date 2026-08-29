import { AppHeader } from '@/widgets/app-header';
import { StatusMessage } from '@/widgets/status-message';
import { Outlet } from 'react-router-dom';

export function App() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <StatusMessage />
      <AppHeader />
      <Outlet />
    </div>
  );
}
