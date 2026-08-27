import { NavLink } from 'react-router-dom';

import calendarIcon from '@/shared/assets/icons/calendar.svg';
import { Avatar, AvatarFallback } from '@/shared/ui/kit/avatar';
import { ROUTES } from '@/shared/model/routes';

export function AppHeader() {
  return (
    <header className="flex h-15 items-center justify-between border-b border-border">
      <NavLink
        to={ROUTES.ROOMS}
        aria-label="BookRoom — переговорные"
        className="flex items-center gap-2"
      >
        <span className="flex size-8 items-center justify-center rounded-md bg-primary">
          <img src={calendarIcon} alt="" className="size-[18px]" />
        </span>
        <span className="text-[20px] font-bold tracking-[-0.04em] text-slate-950">BookRoom</span>
      </NavLink>

      <nav aria-label="Основная навигация" className="flex h-full self-stretch items-center gap-11">
        <NavLink
          to={ROUTES.ROOMS}
          className={({ isActive }) =>
            `relative flex h-full items-center text-[15px] font-semibold transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary ${
              isActive ? 'text-primary' : 'text-slate-500 after:hidden'
            }`
          }
        >
          Переговорные
        </NavLink>
        <NavLink
          to={ROUTES.BOOKINGS}
          className={({ isActive }) =>
            `relative flex h-full items-center text-[15px] font-semibold transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary ${
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-muted-foreground/75 after:hidden'
            }`
          }
        >
          Мои бронирования
        </NavLink>
      </nav>

      <NavLink to="#" className="flex items-center gap-2">
        <span className="text-[14px] font-semibold text-slate-950">Константин К.</span>
        <Avatar size="lg" className="bg-[#5478D9] text-white after:border-transparent">
          <AvatarFallback className="bg-transparent text-[14px] font-semibold text-white">
            КК
          </AvatarFallback>
        </Avatar>
      </NavLink>
    </header>
  );
}
