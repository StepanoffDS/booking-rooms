import { Link } from 'react-router-dom';

import { HomeIcon } from '@/shared/assets/icons/home';
import { ROUTES } from '@/shared/model/routes';
import { Button } from '@/shared/ui/kit/button';

function NotFoundPage() {
  return (
    <main className="container flex flex-1 px-6 py-10">
      <section
        className="flex flex-1 flex-col items-center justify-center bg-slate-50 pb-20 text-center"
        aria-labelledby="not-found-title"
      >
        <p className="text-[9.5rem] leading-none font-extrabold text-primary">404</p>
        <h1 id="not-found-title" className="mt-5 text-4xl font-bold">
          Страница не найдена
        </h1>
        <p className="mt-4 max-w-xl text-xl text-muted-foreground">
          Запрашиваемая страница не существует, была удалена или перенесена на другой адрес.
        </p>
        <Button
          render={<Link to={ROUTES.ROOMS} />}
          className="mt-10 h-12 rounded-lg px-9 text-base font-bold gap-2"
        >
          <HomeIcon aria-hidden="true" className="size-4.5" />
          Вернуться к переговорным
        </Button>
      </section>
    </main>
  );
}

export const Component = NotFoundPage;
