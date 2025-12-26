import { memo, useMemo } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import type { JsonValue } from '@/lib/types/schema';

interface RawJsonViewProps {
  data: JsonValue;
}

interface TokenSpan {
  content: string;
  type: 'key' | 'string' | 'number' | 'boolean' | 'null' | 'bracket' | 'punctuation';
}

function tokenize(json: string): TokenSpan[] {
  const tokens: TokenSpan[] = [];
  let i = 0;

  while (i < json.length) {
    const char = json[i];

    // Whitespace
    if (/\s/.test(char)) {
      let ws = '';
      while (i < json.length && /\s/.test(json[i])) {
        ws += json[i];
        i++;
      }
      tokens.push({ content: ws, type: 'punctuation' });
      continue;
    }

    // Brackets and braces
    if (/[{}\[\]]/.test(char)) {
      tokens.push({ content: char, type: 'bracket' });
      i++;
      continue;
    }

    // Punctuation
    if (/[,:]/.test(char)) {
      tokens.push({ content: char, type: 'punctuation' });
      i++;
      continue;
    }

    // String
    if (char === '"') {
      let str = '"';
      i++;
      while (i < json.length && json[i] !== '"') {
        if (json[i] === '\\' && i + 1 < json.length) {
          str += json[i] + json[i + 1];
          i += 2;
        } else {
          str += json[i];
          i++;
        }
      }
      str += '"';
      i++;

      // Check if this is a key (followed by colon)
      let j = i;
      while (j < json.length && /\s/.test(json[j])) j++;
      const isKey = json[j] === ':';

      tokens.push({ content: str, type: isKey ? 'key' : 'string' });
      continue;
    }

    // Number
    if (/[-\d]/.test(char)) {
      let num = '';
      while (i < json.length && /[-\d.eE+]/.test(json[i])) {
        num += json[i];
        i++;
      }
      tokens.push({ content: num, type: 'number' });
      continue;
    }

    // Boolean or null
    if (json.slice(i, i + 4) === 'true') {
      tokens.push({ content: 'true', type: 'boolean' });
      i += 4;
      continue;
    }
    if (json.slice(i, i + 5) === 'false') {
      tokens.push({ content: 'false', type: 'boolean' });
      i += 5;
      continue;
    }
    if (json.slice(i, i + 4) === 'null') {
      tokens.push({ content: 'null', type: 'null' });
      i += 4;
      continue;
    }

    // Unknown - shouldn't happen with valid JSON
    tokens.push({ content: char, type: 'punctuation' });
    i++;
  }

  return tokens;
}

function getTokenClassName(type: TokenSpan['type']): string {
  switch (type) {
    case 'key':
      return 'text-[hsl(var(--syntax-key))]';
    case 'string':
      return 'text-type-string';
    case 'number':
      return 'text-type-number';
    case 'boolean':
      return 'text-type-boolean';
    case 'null':
      return 'text-type-null italic';
    case 'bracket':
      return 'text-[hsl(var(--syntax-bracket))]';
    default:
      return 'text-muted-foreground';
  }
}

export const RawJsonView = memo(function RawJsonView({ data }: RawJsonViewProps) {
  const formatted = useMemo(() => JSON.stringify(data, null, 2), [data]);
  const tokens = useMemo(() => tokenize(formatted), [formatted]);

  return (
    <div className="relative border border-border rounded-lg overflow-hidden">
      <div className="absolute top-3 right-3 z-10">
        <CopyButton value={formatted} />
      </div>
      <div className="overflow-auto max-h-[600px] scrollbar-thin">
        <pre className="p-4 font-mono text-sm leading-relaxed">
          <code>
            {tokens.map((token, i) => (
              <span key={i} className={getTokenClassName(token.type)}>
                {token.content}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
});
