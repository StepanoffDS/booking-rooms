import 'react-router-dom';

export const ROUTES = {
  HOME: '/',
  ROOMS: '/rooms',
  ROOM: '/rooms/:roomId',
  BOOKINGS: '/bookings',
};

export type PathParams = {
  [ROUTES.ROOM]: { roomId: string };
};

declare module 'react-router-dom' {
  interface Register {
    params: PathParams;
  }
}
