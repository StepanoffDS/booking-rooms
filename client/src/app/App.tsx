import { AppHeader } from '@/widgets/app-header';
import { Outlet } from 'react-router-dom';

export function App() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <Outlet />
    </div>
  );
}
