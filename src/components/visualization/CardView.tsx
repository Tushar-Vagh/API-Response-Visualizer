import { memo, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { TypeBadge } from '@/components/common/TypeBadge';
import { CopyButton } from '@/components/common/CopyButton';
import type { JsonValue, JsonObject, JsonArray } from '@/lib/types/schema';
import { getType } from '@/lib/parser/schemaAnalyzer';

interface CardViewProps {
  data: JsonValue;
  expandAll?: boolean;
}

interface CardItemProps {
  keyName: string;
  value: JsonValue;
  depth: number;
  expandAll: boolean;
}

const CardItem = memo(function CardItem({ keyName, value, depth, expandAll }: CardItemProps) {
  const [isExpanded, setIsExpanded] = useState(expandAll || depth < 2);
  const type = getType(value);
  const isComplex = type === 'object' || type === 'array';

  const formattedValue = (): string => {
    if (value === null) return 'null';
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (Array.isArray(value)) return `[${value.length} items]`;
    if (typeof value === 'object') return `{${Object.keys(value).length} keys}`;
    return String(value);
  };

  return (
    <div
      className={`
        border border-border/50 rounded-lg overflow-hidden
        ${depth === 0 ? 'bg-card' : 'bg-muted/20'}
      `}
    >
      <div
        className={`
          flex items-center gap-3 px-4 py-3
          ${isComplex ? 'cursor-pointer hover:bg-muted/30' : ''}
        `}
        onClick={() => isComplex && setIsExpanded(!isExpanded)}
      >
        {isComplex && (
          <span className="text-muted-foreground">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        )}
        {!isComplex && <span className="w-4" />}

        <span className="font-mono text-sm font-medium text-foreground">
          {keyName}
        </span>

        <TypeBadge type={type} />

        <span className="flex-1" />

        {!isComplex && (
          <>
            <span
              className={`
                font-mono text-sm truncate max-w-[200px]
                ${type === 'string' ? 'text-type-string' : ''}
                ${type === 'number' ? 'text-type-number' : ''}
                ${type === 'boolean' ? 'text-type-boolean' : ''}
                ${type === 'null' ? 'text-type-null italic' : ''}
              `}
            >
              {formattedValue()}
            </span>
            <CopyButton value={formattedValue()} />
          </>
        )}

        {isComplex && (
          <span className="text-xs text-muted-foreground">
            {formattedValue()}
          </span>
        )}
      </div>

      {isComplex && isExpanded && (
        <div className="px-4 pb-4 space-y-2">
          {Array.isArray(value) ? (
            (value as JsonArray).map((item, index) => (
              <CardItem
                key={index}
                keyName={`[${index}]`}
                value={item}
                depth={depth + 1}
                expandAll={expandAll}
              />
            ))
          ) : (
            Object.entries(value as JsonObject).map(([key, val]) => (
              <CardItem
                key={key}
                keyName={key}
                value={val}
                depth={depth + 1}
                expandAll={expandAll}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
});

export const CardView = memo(function CardView({ data, expandAll = false }: CardViewProps) {
  const type = getType(data);

  if (type !== 'object' && type !== 'array') {
    return (
      <div className="border border-border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <TypeBadge type={type} />
          <span className="font-mono text-sm">{JSON.stringify(data)}</span>
        </div>
      </div>
    );
  }

  if (Array.isArray(data)) {
    return (
      <div className="space-y-2">
        {(data as JsonArray).map((item, index) => (
          <CardItem
            key={index}
            keyName={`[${index}]`}
            value={item}
            depth={0}
            expandAll={expandAll}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {Object.entries(data as JsonObject).map(([key, value]) => (
        <CardItem
          key={key}
          keyName={key}
          value={value}
          depth={0}
          expandAll={expandAll}
        />
      ))}
    </div>
  );
});
