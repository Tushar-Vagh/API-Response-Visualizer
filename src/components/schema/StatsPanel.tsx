import { Database, Layers, Hash, AlertCircle } from 'lucide-react';
import type { JsonStats } from '@/lib/types/schema';

interface StatsPanelProps {
  stats: JsonStats;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  const items = [
    { icon: Hash, label: 'Keys', value: stats.totalKeys },
    { icon: Database, label: 'Values', value: stats.totalValues },
    { icon: Layers, label: 'Depth', value: stats.maxDepth },
    { icon: AlertCircle, label: 'Nulls', value: stats.nullCount, highlight: stats.nullCount > 0 },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      {items.map(({ icon: Icon, label, value, highlight }) => (
        <div
          key={label}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-md
            ${highlight ? 'bg-warning/10 text-warning' : 'bg-muted/50 text-muted-foreground'}
          `}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="font-medium">{label}:</span>
          <span className="tabular-nums">{value}</span>
        </div>
      ))}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 text-muted-foreground">
        <span className="font-medium">Size:</span>
        <span className="tabular-nums">{stats.estimatedSize}</span>
      </div>
    </div>
  );
}
