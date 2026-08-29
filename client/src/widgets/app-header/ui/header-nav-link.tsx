import { NavLink, type NavLinkProps } from 'react-router-dom';

export function HeaderNavLink({ to, children }: Pick<NavLinkProps, 'to' | 'children'>) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex h-full items-center text-[15px] font-semibold transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary ${
          isActive
            ? 'text-primary'
            : 'text-muted-foreground hover:text-muted-foreground/75 after:hidden'
        }`
      }
    >
      {children}
    </NavLink>
  );
}
