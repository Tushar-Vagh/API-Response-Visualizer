import { Table, LayoutGrid, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ViewMode } from '@/lib/types/schema';

interface ViewToggleProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const views: { mode: ViewMode; icon: typeof Table; label: string }[] = [
  { mode: 'table', icon: Table, label: 'Table' },
  { mode: 'card', icon: LayoutGrid, label: 'Cards' },
  { mode: 'raw', icon: Code, label: 'Raw' },
];

export function ViewToggle({ activeView, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-md border border-border bg-muted/50 p-1">
      {views.map(({ mode, icon: Icon, label }) => (
        <Button
          key={mode}
          variant={activeView === mode ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange(mode)}
          className={`
            gap-1.5 text-xs font-medium
            ${activeView === mode
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
            }
          `}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </Button>
      ))}
    </div>
  );
}
