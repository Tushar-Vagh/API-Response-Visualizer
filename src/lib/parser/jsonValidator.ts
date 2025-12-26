import type { ValidationResult, ValidationError, JsonValue } from '../types/schema';

export function validateJson(input: string): ValidationResult {
  const trimmed = input.trim();
  
  if (!trimmed) {
    return {
      isValid: false,
      error: {
        message: 'Input is empty. Please paste a valid JSON response.',
      },
    };
  }

  try {
    const data = JSON.parse(trimmed) as JsonValue;
    return { isValid: true, data };
  } catch (err) {
    const error = extractParseError(err, trimmed);
    return { isValid: false, error };
  }
}

function extractParseError(err: unknown, input: string): ValidationError {
  if (!(err instanceof SyntaxError)) {
    return { message: 'Unknown parsing error occurred.' };
  }

  const message = err.message;
  const positionMatch = message.match(/position\s+(\d+)/i);
  
  if (!positionMatch) {
    return {
      message: formatErrorMessage(message),
      snippet: getSnippetAround(input, 0),
    };
  }

  const position = parseInt(positionMatch[1], 10);
  const { line, column } = getLineAndColumn(input, position);
  
  return {
    message: formatErrorMessage(message),
    line,
    column,
    snippet: getSnippetAtLine(input, line),
  };
}

function formatErrorMessage(message: string): string {
  const cleanMessage = message
    .replace(/^JSON\.parse:\s*/i, '')
    .replace(/at position \d+/i, '')
    .trim();

  const friendlyMessages: Record<string, string> = {
    'unexpected end of json input': 'JSON is incomplete. Check for missing closing brackets or quotes.',
    'unexpected token': 'Unexpected character found. Check for typos or missing quotes.',
    'expected property name': 'Expected a property name. Keys must be wrapped in double quotes.',
    'unterminated string': 'String is not properly closed. Missing closing quote.',
  };

  const lower = cleanMessage.toLowerCase();
  for (const [pattern, friendly] of Object.entries(friendlyMessages)) {
    if (lower.includes(pattern)) {
      return friendly;
    }
  }

  return cleanMessage || 'Invalid JSON syntax.';
}

function getLineAndColumn(input: string, position: number): { line: number; column: number } {
  const lines = input.substring(0, position).split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}

function getSnippetAtLine(input: string, line: number): string {
  const lines = input.split('\n');
  const targetLine = lines[line - 1] || '';
  const start = Math.max(0, line - 2);
  const end = Math.min(lines.length, line + 1);
  
  return lines
    .slice(start, end)
    .map((l, i) => {
      const lineNum = start + i + 1;
      const marker = lineNum === line ? '→ ' : '  ';
      return `${marker}${lineNum.toString().padStart(3)}: ${l}`;
    })
    .join('\n');
}

function getSnippetAround(input: string, position: number): string {
  const start = Math.max(0, position - 30);
  const end = Math.min(input.length, position + 30);
  let snippet = input.substring(start, end);
  
  if (start > 0) snippet = '...' + snippet;
  if (end < input.length) snippet = snippet + '...';
  
  return snippet;
}

export function isValidJsonString(input: string): boolean {
  try {
    JSON.parse(input);
    return true;
  } catch {
    return false;
  }
}
