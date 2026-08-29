import { NavLink } from 'react-router-dom';

import { useCurrentUser } from '@/entities/user';
import { ROUTES } from '@/shared/model/routes';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/kit/avatar';
import { HeaderNavLink } from './header-nav-link';
import { CheckCalendarIcon } from '@/shared/assets/icons/check-calendar';

export function AppHeader() {
  const { data: user } = useCurrentUser();

  return (
    <header className="flex h-18 items-center justify-between border-b border-border container">
      <NavLink
        to={ROUTES.ROOMS}
        aria-label="BookRoom — переговорные"
        className="flex items-center gap-2"
      >
        <span className="flex size-9 items-center justify-center rounded-md bg-primary">
          <CheckCalendarIcon aria-hidden="true" className="size-[18px]" />
        </span>
        <span className="text-xl font-bold tracking-[-0.04em]">BookRoom</span>
      </NavLink>

      <nav aria-label="Основная навигация" className="flex h-full self-stretch items-center gap-8">
        <HeaderNavLink to={ROUTES.ROOMS}>Переговорные</HeaderNavLink>
        <HeaderNavLink to={ROUTES.BOOKINGS}>Мои бронирования</HeaderNavLink>
      </nav>

      <NavLink to="#" className="flex items-center gap-2">
        <span className="text-[14px] font-semibold">{user?.displayName}</span>
        <Avatar size="lg" className="bg-[#5478D9] text-white after:border-transparent">
          {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.displayName} />}
          <AvatarFallback className="bg-transparent text-[14px] font-semibold text-white">
            {user?.initials}
          </AvatarFallback>
        </Avatar>
      </NavLink>
    </header>
  );
}
