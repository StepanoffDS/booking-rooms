import { createBrowserRouter, redirect } from 'react-router-dom';

import { ROUTES } from '@/shared/model/routes';

import { Providers } from './providers';
import { App } from './App';

export const router = createBrowserRouter([
  {
    element: (
      <Providers>
        <App />
      </Providers>
    ),
    children: [
      {
        path: ROUTES.HOME,
        loader: () => redirect(ROUTES.ROOMS),
      },
      {
        path: ROUTES.ROOMS,
        lazy: () => import('@/pages/rooms/rooms.page'),
      },
      {
        path: ROUTES.ROOM,
        lazy: () => import('@/pages/room/room.page'),
      },
      {
        path: ROUTES.BOOKINGS,
        lazy: () => import('@/pages/bookings/bookings.page'),
      },
    ],
  },
]);
