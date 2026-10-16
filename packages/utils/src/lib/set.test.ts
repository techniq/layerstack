import { describe, it, expect } from 'vitest';

import { set } from './set.js';

describe('set', () => {
  it('sets value at string path', () => {
    const obj = { a: { b: { c: 1 } } };
    const result = set(obj, 'a.b.c', 3);
    expect(result).toBe(true);
    expect(obj.a.b.c).toBe(3);
  });

  it('sets value at array path', () => {
    const obj = { a: { b: { c: 1 } } };
    const result = set(obj, ['a', 'b', 'c'], 3);
    expect(result).toBe(true);
    expect(obj.a.b.c).toBe(3);
  });

  it('sets value at symbol path', () => {
    const sym = Symbol('key');
    const obj: Record<symbol, any> = {};
    const result = set(obj, sym, 'value');
    expect(result).toBe(true);
    expect(obj[sym]).toBe('value');
  });

  it('creates nested objects when path does not exist', () => {
    const obj: Record<string, any> = {};
    set(obj, 'a.b.c', 'new');
    expect(obj).toEqual({ a: { b: { c: 'new' } } });
  });

  it('overwrites existing value', () => {
    const obj = { a: 'old' };
    set(obj, 'a', 'new');
    expect(obj.a).toBe('new');
  });

  it('handles array indices in string path', () => {
    const obj: Record<string, any> = { a: [{}, {}] };
    set(obj, 'a.0.b', 1);
    set(obj, 'a.1.b', 2);
    expect(obj.a[0].b).toBe(1);
    expect(obj.a[1].b).toBe(2);
  });

  it('handles array indices in array path', () => {
    const obj: Record<string, any> = { a: [{}, {}] };
    set(obj, ['a', 0, 'b'], 1);
    set(obj, ['a', 1, 'b'], 2);
    expect(obj.a[0].b).toBe(1);
    expect(obj.a[1].b).toBe(2);
  });

  it('returns false for empty path', () => {
    const obj = { a: 1 };
    expect(set(obj, [], 'value')).toBe(false);
  });

  it('throws error for __proto__ path', () => {
    const obj = {};
    expect(() => set(obj, '__proto__', {})).toThrow('setting of prototype values not supported');
    expect(() => set(obj, ['__proto__'], {})).toThrow('setting of prototype values not supported');
  });

  it('throws error for constructor path', () => {
    const obj = {};
    expect(() => set(obj, 'constructor', {})).toThrow('setting of prototype values not supported');
  });

  it('throws error for prototype path', () => {
    const obj = {};
    expect(() => set(obj, 'prototype', {})).toThrow('setting of prototype values not supported');
  });

  it('throws error for __proto__ in nested path', () => {
    const obj: Record<string, any> = { a: {} };
    expect(() => set(obj, 'a.__proto__.b', 'value')).toThrow(
      'setting of prototype values not supported'
    );
  });

  it('returns false when intermediate path is not an object', () => {
    const obj = { a: 'string' };
    const result = set(obj, 'a.b.c', 'value');
    expect(result).toBe(false);
  });

  it('returns false when intermediate path is null', () => {
    const obj: Record<string, any> = { a: null };
    const result = set(obj, 'a.b', 'value');
    expect(result).toBe(false);
  });

  it('sets value with various types', () => {
    const obj: Record<string, any> = {};
    set(obj, 'string', 'hello');
    set(obj, 'number', 42);
    set(obj, 'boolean', true);
    set(obj, 'array', [1, 2, 3]);
    set(obj, 'object', { nested: true });
    set(obj, 'null', null);

    expect(obj.string).toBe('hello');
    expect(obj.number).toBe(42);
    expect(obj.boolean).toBe(true);
    expect(obj.array).toEqual([1, 2, 3]);
    expect(obj.object).toEqual({ nested: true });
    expect(obj.null).toBe(null);
  });

  it('handles deeply nested paths', () => {
    const obj: Record<string, any> = {};
    set(obj, 'a.b.c.d.e.f', 'deep');
    expect(obj.a.b.c.d.e.f).toBe('deep');
  });

  it('mutates the original object', () => {
    const obj = { a: 1 };
    set(obj, 'a', 2);
    expect(obj.a).toBe(2);
  });
});
