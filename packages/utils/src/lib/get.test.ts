import { describe, it, expect } from 'vitest';

import { get } from './get.js';

describe('get', () => {
  it('returns value at string path', () => {
    const obj = { a: { b: { c: 3 } } };
    expect(get(obj, 'a.b.c')).toBe(3);
  });

  it('returns value at array path', () => {
    const obj = { a: { b: { c: 3 } } };
    expect(get(obj, ['a', 'b', 'c'])).toBe(3);
  });

  it('returns value at symbol path', () => {
    const sym = Symbol('key');
    const obj = { [sym]: 'value' };
    expect(get(obj, sym)).toBe('value');
  });

  it('returns defaultValue when path does not exist', () => {
    const obj = { a: { b: 1 } };
    expect(get(obj, 'a.c', 'default')).toBe('default');
    expect(get(obj, 'x.y.z', 42)).toBe(42);
  });

  it('returns defaultValue for null/undefined object', () => {
    expect(get(null, 'a.b', 'default')).toBe('default');
    expect(get(undefined, 'a.b', 'default')).toBe('default');
  });

  it('returns undefined when path does not exist and no default provided', () => {
    const obj = { a: 1 };
    expect(get(obj, 'b')).toBeUndefined();
    expect(get(obj, 'a.b.c')).toBeUndefined();
  });

  it('handles array indices in string path', () => {
    const obj = { a: [{ b: 1 }, { b: 2 }] };
    expect(get(obj, 'a.0.b')).toBe(1);
    expect(get(obj, 'a.1.b')).toBe(2);
  });

  it('handles array indices in array path', () => {
    const obj = { a: [{ b: 1 }, { b: 2 }] };
    expect(get(obj, ['a', 0, 'b'])).toBe(1);
    expect(get(obj, ['a', 1, 'b'])).toBe(2);
  });

  it('returns value when path leads to falsy value', () => {
    const obj = { a: { b: 0, c: false, d: '', e: null } };
    expect(get(obj, 'a.b', 'default')).toBe(0);
    expect(get(obj, 'a.c', 'default')).toBe(false);
    expect(get(obj, 'a.d', 'default')).toBe('');
    expect(get(obj, 'a.e', 'default')).toBe(null);
  });

  it('returns defaultValue when intermediate path is undefined', () => {
    const obj = { a: undefined };
    expect(get(obj, 'a.b', 'default')).toBe('default');
  });

  it('does not mutate the original object', () => {
    const obj = { a: { b: 1 } };
    const original = JSON.stringify(obj);
    get(obj, 'a.b');
    get(obj, 'a.c', 'default');
    expect(JSON.stringify(obj)).toBe(original);
  });

  it('handles empty string path', () => {
    const obj = { '': 'empty-key-value' };
    expect(get(obj, '')).toBe('empty-key-value');
  });

  it('handles deeply nested paths', () => {
    const obj = { a: { b: { c: { d: { e: { f: 'deep' } } } } } };
    expect(get(obj, 'a.b.c.d.e.f')).toBe('deep');
    expect(get(obj, ['a', 'b', 'c', 'd', 'e', 'f'])).toBe('deep');
  });
});
