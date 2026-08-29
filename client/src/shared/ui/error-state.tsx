import { AttentionSignIcon } from '@/shared/assets/icons/attention-triangle-sign';
import { cn } from '@/shared/lib/css';
import { Button } from '@/shared/ui/kit/button';

type ErrorStateProps = {
  title: string;
  description: string;
  onRetry: () => void;
  titleId?: string;
  className?: string;
};

export function ErrorState({ title, description, onRetry, titleId, className }: ErrorStateProps) {
  return (
    <div role="alert" className={cn('flex flex-col items-center justify-center text-center', className)}>
      <div className="flex size-36 items-center justify-center rounded-full bg-red-100">
        <AttentionSignIcon aria-hidden="true" className="size-14" />
      </div>
      <h2 id={titleId} className="mt-9 text-4xl font-bold tracking-[-0.04em]">{title}</h2>
      <p className="mt-3 max-w-md text-xl text-muted-foreground">{description}</p>
      <Button className="mt-7 h-13 rounded-lg px-6 text-base font-bold" onClick={onRetry}>
        Попробовать снова
      </Button>
    </div>
  );
}
