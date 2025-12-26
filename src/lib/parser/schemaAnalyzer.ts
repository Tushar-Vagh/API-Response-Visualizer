import type {
  JsonValue,
  JsonObject,
  JsonArray,
  DataType,
  FieldSchema,
  SchemaDefinition,
  JsonStats,
} from '../types/schema';

export function analyzeSchema(data: JsonValue, depth = 0): SchemaDefinition {
  if (Array.isArray(data)) {
    return analyzeArraySchema(data, depth);
  }
  
  if (data !== null && typeof data === 'object') {
    return analyzeObjectSchema(data, depth);
  }

  return {
    type: 'primitive',
    fields: [],
    depth,
  };
}

function analyzeObjectSchema(obj: JsonObject, depth: number): SchemaDefinition {
  const fields: FieldSchema[] = Object.entries(obj).map(([key, value]) => ({
    key,
    type: getType(value),
    isOptional: false,
    sampleValue: getSampleValue(value),
    childSchema: isComplex(value) ? analyzeSchema(value, depth + 1) : undefined,
    occurrences: 1,
    totalItems: 1,
  }));

  return {
    type: 'object',
    fields,
    depth,
  };
}

function analyzeArraySchema(arr: JsonArray, depth: number): SchemaDefinition {
  if (arr.length === 0) {
    return {
      type: 'array',
      fields: [],
      itemType: undefined,
      depth,
    };
  }

  // Analyze all items to find common schema
  const fieldMap = new Map<string, FieldSchema>();
  const itemTypes = new Set<DataType>();

  arr.forEach((item) => {
    itemTypes.add(getType(item));

    if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
      Object.entries(item).forEach(([key, value]) => {
        const existing = fieldMap.get(key);
        
        if (existing) {
          existing.occurrences++;
          // Update type if we find different types
          if (existing.type !== getType(value)) {
            existing.type = 'object'; // Mixed types
          }
        } else {
          fieldMap.set(key, {
            key,
            type: getType(value),
            isOptional: false,
            sampleValue: getSampleValue(value),
            childSchema: isComplex(value) ? analyzeSchema(value, depth + 1) : undefined,
            occurrences: 1,
            totalItems: arr.length,
          });
        }
      });
    }
  });

  // Mark optional fields
  const fields = Array.from(fieldMap.values()).map((field) => ({
    ...field,
    isOptional: field.occurrences < arr.length,
    totalItems: arr.length,
  }));

  return {
    type: 'array',
    fields,
    itemType: itemTypes.size === 1 ? Array.from(itemTypes)[0] : 'object',
    depth,
  };
}

export function getType(value: JsonValue): DataType {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value as DataType;
}

function getSampleValue(value: JsonValue): JsonValue {
  if (typeof value === 'string' && value.length > 50) {
    return value.substring(0, 50) + '...';
  }
  if (Array.isArray(value)) {
    return `[${value.length} items]`;
  }
  if (value !== null && typeof value === 'object') {
    return `{${Object.keys(value).length} keys}`;
  }
  return value;
}

function isComplex(value: JsonValue): boolean {
  return value !== null && typeof value === 'object';
}

export function calculateStats(data: JsonValue): JsonStats {
  let totalKeys = 0;
  let totalValues = 0;
  let maxDepth = 0;
  let arrayCount = 0;
  let objectCount = 0;
  let nullCount = 0;

  function traverse(value: JsonValue, depth: number): void {
    maxDepth = Math.max(maxDepth, depth);

    if (value === null) {
      nullCount++;
      totalValues++;
      return;
    }

    if (Array.isArray(value)) {
      arrayCount++;
      value.forEach((item) => traverse(item, depth + 1));
      return;
    }

    if (typeof value === 'object') {
      objectCount++;
      Object.entries(value).forEach(([, v]) => {
        totalKeys++;
        traverse(v, depth + 1);
      });
      return;
    }

    totalValues++;
  }

  traverse(data, 0);

  const jsonString = JSON.stringify(data);
  const bytes = new TextEncoder().encode(jsonString).length;
  const estimatedSize = formatBytes(bytes);

  return {
    totalKeys,
    totalValues,
    maxDepth,
    arrayCount,
    objectCount,
    nullCount,
    estimatedSize,
  };
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function flattenForTable(
  data: JsonValue,
  prefix = ''
): Array<{ path: string; value: JsonValue; type: DataType }> {
  const rows: Array<{ path: string; value: JsonValue; type: DataType }> = [];

  if (data === null || typeof data !== 'object') {
    return [{ path: prefix || 'value', value: data, type: getType(data) }];
  }

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const path = prefix ? `${prefix}[${index}]` : `[${index}]`;
      if (item !== null && typeof item === 'object') {
        rows.push(...flattenForTable(item, path));
      } else {
        rows.push({ path, value: item, type: getType(item) });
      }
    });
  } else {
    Object.entries(data).forEach(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      if (value !== null && typeof value === 'object') {
        rows.push(...flattenForTable(value, path));
      } else {
        rows.push({ path, value, type: getType(value) });
      }
    });
  }

  return rows;
}
