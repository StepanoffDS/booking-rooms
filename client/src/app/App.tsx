import { AppHeader } from '@/widgets/app-header';
import { Outlet } from 'react-router-dom';

export function App() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1360px] flex-col px-8">
      <AppHeader />
      <Outlet />
    </div>
  );
}
