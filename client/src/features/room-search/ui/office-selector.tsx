import type { Office } from '@/entities/office';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/kit/select';

export function OfficeSelector({
  offices,
  value,
  onChange,
}: {
  offices: Office[];
  value: string;
  onChange: (officeId: string) => void;
}) {
  const selectedOffice = offices.find(({ id }) => id === value);

  return (
    <section className="container border-b border-border py-6" aria-labelledby="office-title">
      <Select value={value} onValueChange={(officeId) => officeId && onChange(officeId)}>
        <SelectTrigger
          id="office-title"
          aria-label="Офис"
          className="h-auto gap-2 border-0 bg-transparent p-0 text-lg font-bold shadow-none hover:bg-transparent"
        >
          <SelectValue placeholder="Выберите офис">{selectedOffice?.name}</SelectValue>
        </SelectTrigger>
        <SelectContent align="start" className="min-w-[240px]">
          <SelectGroup>
            {offices.map((office) => (
              <SelectItem key={office.id} value={office.id}>
                {office.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="mt-1 flex items-center gap-3 text-base text-muted-foreground text-[13px]">
        <span>{selectedOffice ? selectedOffice.address : 'Адрес не выбран'}</span>
        <span aria-hidden="true">•</span>
        <span>{selectedOffice ? selectedOffice.timezone : 'Местное время: ---'}</span>
      </div>
    </section>
  );
}
