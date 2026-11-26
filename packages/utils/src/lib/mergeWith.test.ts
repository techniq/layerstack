import { describe, it, expect } from 'vitest';

import { merge, mergeWith, defaultsDeep } from './mergeWith.js';

describe('merge', () => {
  it('merges flat objects', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };

    const result = merge(target, source);

    expect(result).toEqual({ a: 1, b: 3, c: 4 });
    expect(result).toBe(target);
  });

  it('deep merges nested objects', () => {
    const target = { a: { x: 1, y: 2 }, b: 1 };
    const source = { a: { y: 3, z: 4 }, c: 2 };

    const result = merge(target, source);

    expect(result).toEqual({
      a: { x: 1, y: 3, z: 4 },
      b: 1,
      c: 2,
    });
  });

  it('merges arrays by index with plain objects', () => {
    const target = { items: [{ a: 1 }, { b: 2 }] };
    const source = { items: [{ a: 10 }, { c: 3 }] };

    const result = merge(target, source);

    expect(result).toEqual({
      items: [{ a: 10 }, { b: 2, c: 3 }],
    });
  });

  it('replaces array items that are not plain objects', () => {
    const target = { a: [1, 2, 3] };
    const source = { a: [4, 5] };

    const result = merge(target, source);

    expect(result).toEqual({ a: [4, 5, 3] });
  });

  it('handles multiple sources', () => {
    const target = { a: 1 };
    const source1 = { b: 2 };
    const source2 = { c: 3 };

    const result = merge(target, source1, source2);

    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('creates nested objects if target property is not an object', () => {
    const target = { a: 1 } as any;
    const source = { a: { nested: true } };

    const result = merge(target, source);

    expect(result).toEqual({ a: { nested: true } });
  });

  it('creates arrays if target property is not an array', () => {
    const target = { a: 'string' } as any;
    const source = { a: [1, 2] };

    const result = merge(target, source);

    expect(result).toEqual({ a: [1, 2] });
  });

  it('works with multiple levels of nesting', () => {
    const target = {
      level1: {
        level2: {
          level3: { a: 1 },
        },
      },
    };
    const source = {
      level1: {
        level2: {
          level3: { b: 2 },
        },
      },
    };

    const result = merge(target, source);

    expect(result).toEqual({
      level1: {
        level2: {
          level3: { a: 1, b: 2 },
        },
      },
    });
  });
});

describe('mergeWith', () => {
  it('uses customizer result when not undefined', () => {
    const target = { a: [1, 2], b: [3] };
    const source = { a: [4], b: [5, 6] };

    const result = mergeWith(target, source, (tgtVal: any, srcVal: any) => {
      if (Array.isArray(tgtVal) && Array.isArray(srcVal)) {
        return [...tgtVal, ...srcVal];
      }
    });

    expect(result).toEqual({
      a: [1, 2, 4],
      b: [3, 5, 6],
    });
  });

  it('customizer can replace arrays entirely', () => {
    const target = { items: [1, 2] };
    const source = { items: [3] };

    const result = mergeWith(target, source, (_: any, srcVal: any) => {
      if (Array.isArray(srcVal)) return srcVal;
    });

    expect(result).toEqual({ items: [3] });
  });

  it('falls back to default merge when customizer returns undefined', () => {
    const target = { a: { x: 1 }, b: 2 };
    const source = { a: { y: 2 }, c: 3 };

    const result = mergeWith(target, source, () => undefined);

    expect(result).toEqual({ a: { x: 1, y: 2 }, b: 2, c: 3 });
  });

  it('provides correct arguments to customizer', () => {
    const target = { a: 1 };
    const source = { a: 2, b: 3 };
    const calls: any[] = [];

    mergeWith(target, source, (tgtVal: any, srcVal: any, key: any) => {
      calls.push({ tgtVal, srcVal, key });
      return undefined;
    });

    expect(calls).toEqual([
      { tgtVal: 1, srcVal: 2, key: 'a' },
      { tgtVal: undefined, srcVal: 3, key: 'b' },
    ]);
  });

  it('supports multiple sources with customizer', () => {
    const result = mergeWith(
      {},
      { a: 'one', b: 'two' },
      { b: 'THREE', c: 'four' },
      (tgt: string, src: string) => (tgt ? `${tgt} ${src}` : undefined)
    );

    expect(result).toEqual({ a: 'one', b: 'two THREE', c: 'four' });
  });

  it('skips null/undefined sources', () => {
    const result = mergeWith({}, { a: 1 }, null, undefined, { b: 2 }, () => undefined);

    expect(result).toEqual({ a: 1, b: 2 });
  });
});

describe('defaultsDeep', () => {
  it('fills in undefined values from defaults', () => {
    const result = defaultsDeep({ a: 1 }, { a: 2, b: 3 });
    expect(result).toEqual({ a: 1, b: 3 });
  });

  it('deeply fills in nested defaults', () => {
    const result = defaultsDeep({ a: { b: 2 } }, { a: { b: 1, c: 3 } });
    expect(result).toEqual({ a: { b: 2, c: 3 } });
  });

  it('preserves existing values at all levels', () => {
    const result = defaultsDeep(
      { level1: { level2: { existing: 'keep' } } },
      { level1: { level2: { existing: 'replace', added: 'new' }, other: 'value' } }
    );
    expect(result).toEqual({
      level1: { level2: { existing: 'keep', added: 'new' }, other: 'value' },
    });
  });

  it('handles multiple default sources', () => {
    const result = defaultsDeep({ a: 1 }, { b: 2 }, { c: 3, a: 100 });
    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('does not override with undefined source values', () => {
    const result = defaultsDeep({ a: 1 }, { a: undefined, b: 2 });
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('keeps arrays from target', () => {
    const result = defaultsDeep({ items: [1, 2] }, { items: [3, 4, 5] });
    expect(result).toEqual({ items: [1, 2] });
  });

  it('fills in arrays when target has undefined', () => {
    const result = defaultsDeep({}, { items: [1, 2] });
    expect(result).toEqual({ items: [1, 2] });
  });
});
