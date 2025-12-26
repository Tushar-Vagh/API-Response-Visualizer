import { FileJson } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
        <FileJson className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">
        No JSON to visualize
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Paste an API response or upload a JSON file to see it visualized in table, card, or raw format.
      </p>
    </div>
  );
}
