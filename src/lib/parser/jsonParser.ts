import type { ParsedJson, JsonValue } from '../types/schema';
import { validateJson } from './jsonValidator';
import { analyzeSchema, calculateStats } from './schemaAnalyzer';

export interface ParseResult {
  success: true;
  parsed: ParsedJson;
}

export interface ParseError {
  success: false;
  error: {
    message: string;
    line?: number;
    column?: number;
    snippet?: string;
  };
}

export type ParseOutcome = ParseResult | ParseError;

export function parseJsonInput(input: string): ParseOutcome {
  const validation = validateJson(input);

  if (!validation.isValid || !validation.data) {
    return {
      success: false,
      error: validation.error || { message: 'Unknown validation error' },
    };
  }

  const data = validation.data;
  const schema = analyzeSchema(data);
  const stats = calculateStats(data);

  return {
    success: true,
    parsed: {
      raw: input.trim(),
      data,
      schema,
      stats,
    },
  };
}

export function formatJson(data: JsonValue, indent = 2): string {
  return JSON.stringify(data, null, indent);
}

export function minifyJson(data: JsonValue): string {
  return JSON.stringify(data);
}

export async function parseJsonFile(file: File): Promise<ParseOutcome> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        resolve(parseJsonInput(content));
      } else {
        resolve({
          success: false,
          error: { message: 'Failed to read file content.' },
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        error: { message: 'Failed to read file. Please try again.' },
      });
    };

    reader.readAsText(file);
  });
}
