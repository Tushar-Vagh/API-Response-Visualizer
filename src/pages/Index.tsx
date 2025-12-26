import { Helmet } from 'react-helmet-async';
import { Braces } from 'lucide-react';
import { useJsonParser } from '@/hooks/useJsonParser';
import { JsonInput } from '@/components/input/JsonInput';
import { ViewToggle } from '@/components/visualization/ViewToggle';
import { SearchFilter } from '@/components/common/SearchFilter';
import { TableView } from '@/components/visualization/TableView';
import { CardView } from '@/components/visualization/CardView';
import { RawJsonView } from '@/components/visualization/RawJsonView';
import { EmptyState } from '@/components/states/EmptyState';
import { StatsPanel } from '@/components/schema/StatsPanel';

export default function Index() {
  const {
    input,
    parsed,
    error,
    isLoading,
    viewMode,
    filter,
    filteredTableData,
    handleParse,
    handleFileUpload,
    setViewMode,
    setFilter,
    clearAll,
  } = useJsonParser();

  return (
    <>
      <Helmet>
        <title>API Response Visualizer | JSON Viewer for Developers</title>
        <meta
          name="description"
          content="Visualize API responses in table, card, or raw JSON format. A developer-friendly tool for parsing and exploring JSON data."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Braces className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  API Response Visualizer
                </h1>
                <p className="text-sm text-muted-foreground">
                  Parse and explore JSON in human-friendly formats
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container py-8">
          <div className="grid gap-8 lg:grid-cols-[400px,1fr]">
            {/* Input Panel */}
            <aside className="space-y-6">
              <div className="glass-panel rounded-xl p-5">
                <JsonInput
                  value={input}
                  onChange={handleParse}
                  onFileUpload={handleFileUpload}
                  onClear={clearAll}
                  isLoading={isLoading}
                  error={error}
                />
              </div>

              {parsed && (
                <div className="glass-panel rounded-xl p-5 animate-fade-in">
                  <h2 className="text-sm font-medium text-foreground mb-3">
                    Statistics
                  </h2>
                  <StatsPanel stats={parsed.stats} />
                </div>
              )}
            </aside>

            {/* Visualization Panel */}
            <section className="space-y-4">
              {parsed ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <ViewToggle activeView={viewMode} onViewChange={setViewMode} />
                    <SearchFilter
                      filter={filter}
                      onFilterChange={setFilter}
                      resultCount={viewMode === 'table' ? filteredTableData.length : undefined}
                    />
                  </div>

                  <div className="glass-panel rounded-xl p-5 animate-fade-in">
                    {viewMode === 'table' && <TableView data={filteredTableData} />}
                    {viewMode === 'card' && (
                      <CardView data={parsed.data} expandAll={filter.expandAll} />
                    )}
                    {viewMode === 'raw' && <RawJsonView data={parsed.data} />}
                  </div>
                </>
              ) : (
                <div className="glass-panel rounded-xl">
                  <EmptyState />
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
