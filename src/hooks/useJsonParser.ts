import { useState, useCallback, useMemo } from 'react';
import type { ParsedJson, ViewMode, FilterState } from '@/lib/types/schema';
import { parseJsonInput, parseJsonFile, type ParseOutcome } from '@/lib/parser/jsonParser';
import { flattenForTable } from '@/lib/parser/schemaAnalyzer';

interface ParserState {
  input: string;
  parsed: ParsedJson | null;
  error: { message: string; line?: number; column?: number; snippet?: string } | null;
  isLoading: boolean;
  viewMode: ViewMode;
  filter: FilterState;
}

const initialFilter: FilterState = {
  searchQuery: '',
  showNullValues: true,
  expandAll: false,
};

export function useJsonParser() {
  const [state, setState] = useState<ParserState>({
    input: '',
    parsed: null,
    error: null,
    isLoading: false,
    viewMode: 'table',
    filter: initialFilter,
  });

  const handleParse = useCallback((input: string) => {
    if (!input.trim()) {
      setState((prev) => ({
        ...prev,
        input,
        parsed: null,
        error: null,
      }));
      return;
    }

    setState((prev) => ({ ...prev, input, isLoading: true }));

    // Simulate slight delay for UX
    setTimeout(() => {
      const result: ParseOutcome = parseJsonInput(input);

      if (result.success) {
        setState((prev) => ({
          ...prev,
          parsed: result.parsed,
          error: null,
          isLoading: false,
        }));
      } else {
        const errorResult = result as { success: false; error: { message: string; line?: number; column?: number; snippet?: string } };
        setState((prev) => ({
          ...prev,
          parsed: null,
          error: errorResult.error,
          isLoading: false,
        }));
      }
    }, 150);
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    const result = await parseJsonFile(file);

    if (result.success) {
      setState((prev) => ({
        ...prev,
        input: result.parsed.raw,
        parsed: result.parsed,
        error: null,
        isLoading: false,
      }));
    } else {
      const errorResult = result as { success: false; error: { message: string; line?: number; column?: number; snippet?: string } };
      setState((prev) => ({
        ...prev,
        parsed: null,
        error: errorResult.error,
        isLoading: false,
      }));
    }
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    setState((prev) => ({ ...prev, viewMode: mode }));
  }, []);

  const setFilter = useCallback((updates: Partial<FilterState>) => {
    setState((prev) => ({
      ...prev,
      filter: { ...prev.filter, ...updates },
    }));
  }, []);

  const clearAll = useCallback(() => {
    setState({
      input: '',
      parsed: null,
      error: null,
      isLoading: false,
      viewMode: 'table',
      filter: initialFilter,
    });
  }, []);

  const filteredTableData = useMemo(() => {
    if (!state.parsed) return [];

    const rows = flattenForTable(state.parsed.data);
    const { searchQuery, showNullValues } = state.filter;

    return rows.filter((row) => {
      if (!showNullValues && row.value === null) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const pathMatch = row.path.toLowerCase().includes(query);
        const valueMatch = String(row.value).toLowerCase().includes(query);
        return pathMatch || valueMatch;
      }
      return true;
    });
  }, [state.parsed, state.filter]);

  return {
    ...state,
    filteredTableData,
    handleParse,
    handleFileUpload,
    setViewMode,
    setFilter,
    clearAll,
  };
}
