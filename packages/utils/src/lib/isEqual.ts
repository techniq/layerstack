export function isEqual(a: any, b: any, seen = new WeakMap()): boolean {
  if (a === b || (a !== a && b !== b)) return true; // identical or both NaN
  if (a == null || b == null) return a === b;
  if (typeof a !== 'object' || typeof b !== 'object') return false;

  // Circular reference handling
  if (seen.has(a)) return seen.get(a) === b;
  seen.set(a, b);

  // Dates
  if (a instanceof Date && b instanceof Date) return +a === +b;
  if (a instanceof Date || b instanceof Date) return false;

  // Maps
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [k, v] of a) if (!b.has(k) || !isEqual(v, b.get(k), seen)) return false;
    return true;
  }
  if (a instanceof Map || b instanceof Map) return false;

  // Sets
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    for (const v of a) if (!b.has(v)) return false;
    return true;
  }
  if (a instanceof Set || b instanceof Set) return false;

  // Arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => isEqual(v, b[i], seen));
  }
  if (Array.isArray(a) || Array.isArray(b)) return false;

  // Plain objects
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  return keysA.length === keysB.length && keysA.every((k) => k in b && isEqual(a[k], b[k], seen));
}
