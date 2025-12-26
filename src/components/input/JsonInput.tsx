import { useCallback, useRef } from 'react';
import { FileJson, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface JsonInputProps {
  value: string;
  onChange: (value: string) => void;
  onFileUpload: (file: File) => void;
  onClear: () => void;
  isLoading: boolean;
  error: { message: string; line?: number; column?: number; snippet?: string } | null;
}

export function JsonInput({
  value,
  onChange,
  onFileUpload,
  onClear,
  isLoading,
  error,
}: JsonInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileUpload(file);
        e.target.value = '';
      }
    },
    [onFileUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file && file.type === 'application/json') {
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileJson className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">JSON Input</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Upload className="mr-2 h-3 w-3" />
            Upload
          </Button>
          {value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              disabled={isLoading}
            >
              <X className="mr-2 h-3 w-3" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative"
      >
        <Textarea
          value={value}
          onChange={handleTextChange}
          placeholder='Paste your API response here...&#10;&#10;Example:&#10;{&#10;  "users": [&#10;    { "id": 1, "name": "John" }&#10;  ]&#10;}'
          className={`
            min-h-[200px] resize-y font-mono text-sm
            bg-muted/50 border-border
            placeholder:text-muted-foreground/50
            focus:ring-1 focus:ring-primary/50
            ${error ? 'border-destructive focus:ring-destructive/50' : ''}
            ${isLoading ? 'opacity-50' : ''}
          `}
          disabled={isLoading}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md">
            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 space-y-2">
          <p className="text-sm text-destructive font-medium">{error.message}</p>
          {error.line && (
            <p className="text-xs text-muted-foreground">
              Line {error.line}, Column {error.column}
            </p>
          )}
          {error.snippet && (
            <pre className="text-xs font-mono text-muted-foreground bg-muted/50 p-2 rounded overflow-x-auto">
              {error.snippet}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
