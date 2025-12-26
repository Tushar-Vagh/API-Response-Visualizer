import { Search, Eye, EyeOff, ChevronsUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { FilterState } from '@/lib/types/schema';

interface SearchFilterProps {
  filter: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  resultCount?: number;
}

export function SearchFilter({ filter, onFilterChange, resultCount }: SearchFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search keys or values..."
          value={filter.searchQuery}
          onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          className="pl-9 bg-muted/50 border-border text-sm h-9"
        />
        {resultCount !== undefined && filter.searchQuery && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {resultCount} results
          </span>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onFilterChange({ showNullValues: !filter.showNullValues })}
        className={`gap-1.5 text-xs ${!filter.showNullValues ? 'bg-muted' : ''}`}
      >
        {filter.showNullValues ? (
          <Eye className="h-3.5 w-3.5" />
        ) : (
          <EyeOff className="h-3.5 w-3.5" />
        )}
        Nulls
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onFilterChange({ expandAll: !filter.expandAll })}
        className={`gap-1.5 text-xs ${filter.expandAll ? 'bg-muted' : ''}`}
      >
        <ChevronsUpDown className="h-3.5 w-3.5" />
        {filter.expandAll ? 'Collapse' : 'Expand'}
      </Button>
    </div>
  );
}
