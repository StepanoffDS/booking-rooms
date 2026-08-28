import type { ReactNode } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/kit/select';
import { cn } from '@/shared/lib/css';

export function TransparentSelect({
  label,
  value,
  options,
  prefix,
  onValueChange,
  disabled = false,
  className,
}: {
  label: string;
  value: string;
  options: string[];
  prefix?: ReactNode;
  onValueChange: (value: string | null) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        aria-label={label}
        className={cn(
          'h-9 min-h-9 w-full rounded-md bg-transparent px-3 text-sm font-medium shadow-none',
          className,
        )}
      >
        {prefix && <span className="mr-1 flex shrink-0">{prefix}</span>}
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
