export type BookingScope = 'upcoming' | 'past';

function BookingsScopeTab({
  isActive,
  label,
  onClick,
}: {
  isActive: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative -mb-px border-b-2 pb-3 text-xl font-medium ${isActive ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
    >
      {label}
    </button>
  );
}

export function BookingsScopeTabs({
  scope,
  upcomingCount,
  onScopeChange,
}: {
  scope: BookingScope;
  upcomingCount: number;
  onScopeChange: (scope: BookingScope) => void;
}) {
  return (
    <div className="mt-9 flex gap-8 border-b border-border">
      <BookingsScopeTab
        isActive={scope === 'upcoming'}
        label={`Предстоящие (${upcomingCount})`}
        onClick={() => onScopeChange('upcoming')}
      />
      <BookingsScopeTab
        isActive={scope === 'past'}
        label="Прошедшие"
        onClick={() => onScopeChange('past')}
      />
    </div>
  );
}
