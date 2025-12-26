import { memo } from 'react';
import { TypeBadge } from '@/components/common/TypeBadge';
import { CopyButton } from '@/components/common/CopyButton';
import type { DataType, JsonValue } from '@/lib/types/schema';

interface TableRow {
  path: string;
  value: JsonValue;
  type: DataType;
}

interface TableViewProps {
  data: TableRow[];
}

function formatValue(value: JsonValue): string {
  if (value === null) return 'null';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return String(value);
}

function getValueClassName(type: DataType): string {
  switch (type) {
    case 'string':
      return 'text-type-string';
    case 'number':
      return 'text-type-number';
    case 'boolean':
      return 'text-type-boolean';
    case 'null':
      return 'text-type-null italic';
    default:
      return 'text-foreground';
  }
}

const TableRowComponent = memo(function TableRowComponent({ row }: { row: TableRow }) {
  const displayValue = formatValue(row.value);

  return (
    <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
      <td className="py-2.5 px-4 font-mono text-sm">
        <span className="text-muted-foreground">{row.path}</span>
      </td>
      <td className="py-2.5 px-4 text-center">
        <TypeBadge type={row.type} />
      </td>
      <td className="py-2.5 px-4 font-mono text-sm">
        <div className="flex items-center gap-2">
          <span className={`truncate max-w-[400px] ${getValueClassName(row.type)}`}>
            {displayValue}
          </span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton value={displayValue} />
          </span>
        </div>
      </td>
    </tr>
  );
});

export const TableView = memo(function TableView({ data }: TableViewProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        No data to display
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Path
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-20">
                Type
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <TableRowComponent key={`${row.path}-${index}`} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
