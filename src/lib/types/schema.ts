export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

export type DataType = 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array';

export interface FieldSchema {
  key: string;
  type: DataType;
  isOptional: boolean;
  sampleValue: JsonValue;
  childSchema?: SchemaDefinition;
  occurrences: number;
  totalItems: number;
}

export interface SchemaDefinition {
  type: 'object' | 'array' | 'primitive';
  fields: FieldSchema[];
  itemType?: DataType;
  depth: number;
}

export interface ParsedJson {
  raw: string;
  data: JsonValue;
  schema: SchemaDefinition;
  stats: JsonStats;
}

export interface JsonStats {
  totalKeys: number;
  totalValues: number;
  maxDepth: number;
  arrayCount: number;
  objectCount: number;
  nullCount: number;
  estimatedSize: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: ValidationError;
  data?: JsonValue;
}

export interface ValidationError {
  message: string;
  line?: number;
  column?: number;
  snippet?: string;
}

export type ViewMode = 'table' | 'card' | 'raw';

export interface FilterState {
  searchQuery: string;
  showNullValues: boolean;
  expandAll: boolean;
}
