import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CopyButtonProps {
  value: string;
  size?: 'sm' | 'icon';
}

export function CopyButton({ value, size = 'icon' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [value]);

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleCopy}
      className="h-7 w-7 text-muted-foreground hover:text-foreground"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-success" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}
