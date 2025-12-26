import type { DataType } from '@/lib/types/schema';

interface TypeBadgeProps {
  type: DataType;
  size?: 'sm' | 'md';
}

const typeConfig: Record<DataType, { label: string; className: string }> = {
  string: { label: 'str', className: 'bg-type-string/15 text-type-string border-type-string/30' },
  number: { label: 'num', className: 'bg-type-number/15 text-type-number border-type-number/30' },
  boolean: { label: 'bool', className: 'bg-type-boolean/15 text-type-boolean border-type-boolean/30' },
  null: { label: 'null', className: 'bg-type-null/15 text-type-null border-type-null/30' },
  object: { label: 'obj', className: 'bg-type-object/15 text-type-object border-type-object/30' },
  array: { label: 'arr', className: 'bg-type-array/15 text-type-array border-type-array/30' },
};

export function TypeBadge({ type, size = 'sm' }: TypeBadgeProps) {
  const config = typeConfig[type];

  return (
    <span
      className={`
        inline-flex items-center justify-center font-mono font-medium border rounded
        ${config.className}
        ${size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'}
      `}
    >
      {config.label}
    </span>
  );
}
