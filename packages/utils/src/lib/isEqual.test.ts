import { describe, it, expect } from 'vitest';

import { isEqual } from './isEqual.js';

describe('isEqual', () => {
  it('compares primitives', () => {
    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual(1, 2)).toBe(false);
    expect(isEqual('a', 'a')).toBe(true);
    expect(isEqual(true, false)).toBe(false);
    expect(isEqual(null, null)).toBe(true);
    expect(isEqual(undefined, undefined)).toBe(true);
    expect(isEqual(null, undefined)).toBe(false);
  });

  it('treats NaN as equal to NaN', () => {
    expect(isEqual(Number.NaN, Number.NaN)).toBe(true);
  });

  it('compares arrays deeply', () => {
    expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
  });

  it('compares objects deeply', () => {
    expect(isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true);
    expect(isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } })).toBe(false);
  });

  it('compares dates by timestamp', () => {
    expect(
      isEqual(new Date('2020-01-01T00:00:00.000Z'), new Date('2020-01-01T00:00:00.000Z'))
    ).toBe(true);
    expect(
      isEqual(new Date('2020-01-01T00:00:00.000Z'), new Date('2020-01-02T00:00:00.000Z'))
    ).toBe(false);
  });

  it('handles circular references', () => {
    const a: any = { x: 1 };
    a.self = a;
    const b: any = { x: 1 };
    b.self = b;
    expect(isEqual(a, b)).toBe(true);
  });
});
