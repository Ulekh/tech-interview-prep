export default function deepClone<T>(value: T): T {
  if (Object(value) !== value) {
    return value as T;
  }
  if (typeof value === 'function') {
    return value.bind(null);
  }

  const result: any = Array.isArray(value) ? [] : {};
  for (const [k, v] of Object.entries(value as Record<string, any>)) {
    result[k] = deepClone(v);
  }

  return result as T;
}
