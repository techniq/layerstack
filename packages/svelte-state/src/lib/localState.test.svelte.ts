// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';

import { parse, stringify } from '@layerstack/utils';

import { LocalState } from './localState.svelte.js';

beforeEach(() => {
  localStorage.clear();
});

describe('LocalState', () => {
  it('uses the initial value when nothing is stored, and persists it', () => {
    const state = new LocalState('count', 3);

    expect(state.current).toBe(3);
    expect(parse(localStorage.getItem('count')!)).toBe(3);
  });

  it('reads the stored value in preference to the initial value', () => {
    localStorage.setItem('count', stringify(42));

    const state = new LocalState('count', 3);

    expect(state.current).toBe(42);
  });

  it('persists on every write', () => {
    const state = new LocalState('user', { name: 'Ada' });

    state.current = { name: 'Grace' };

    expect(state.current).toEqual({ name: 'Grace' });
    expect(parse(localStorage.getItem('user')!)).toEqual({ name: 'Grace' });
  });

  it('round-trips values that JSON alone would not, such as Date', () => {
    const date = new Date('2024-03-01T12:00:00Z');
    new LocalState('when', date);

    const restored = new LocalState('when', new Date(0));
    expect(restored.current).toBeInstanceOf(Date);
    expect(restored.current.toISOString()).toBe(date.toISOString());
  });

  it('`override` wins over the stored value, and does not read storage', () => {
    localStorage.setItem('count', stringify(42));

    const state = new LocalState('count', 3, { override: 7 });

    expect(state.current).toBe(7);
  });

  it('resets to the initial value and persists the reset', () => {
    const state = new LocalState('count', 3);
    state.current = 10;

    state.reset();

    expect(state.current).toBe(3);
    expect(parse(localStorage.getItem('count')!)).toBe(3);
  });

  it('clears the stored value without changing `current`', () => {
    const state = new LocalState('count', 3);
    state.current = 10;

    state.clear();

    expect(state.current).toBe(10);
    expect(localStorage.getItem('count')).toBeNull();
  });

  describe('expiry', () => {
    it('stores the value alongside its expiry', () => {
      const expiry = new Date('2999-01-01T00:00:00Z');
      new LocalState('settings', { a: 1 }, { expiry });

      const stored = parse(localStorage.getItem('settings')!);
      expect(stored.value).toEqual({ a: 1 });
      expect(stored.expiry).toEqual(expiry);
    });

    it('keeps values that have not expired', () => {
      const expiry = new Date('2999-01-01T00:00:00Z');
      localStorage.setItem('settings', stringify({ value: { a: 1 }, expiry }));

      const state = new LocalState('settings', { a: 0 }, { expiry });

      expect(state.current).toEqual({ a: 1 });
    });

    it('falls back to the initial value once everything has expired', () => {
      const expiry = new Date('2000-01-01T00:00:00Z');
      localStorage.setItem('settings', stringify({ value: { a: 1 }, expiry }));

      const state = new LocalState('settings', { a: 0 }, { expiry });

      expect(state.current).toEqual({ a: 0 });
    });

    it('derives the next expiry from the previous one', () => {
      const first = new Date('2999-01-01T00:00:00Z');
      const second = new Date('2999-06-01T00:00:00Z');
      const seen: (Date | null | undefined)[] = [];

      const state = new LocalState(
        'settings',
        { a: 1 },
        {
          expiry: (previous) => {
            seen.push(previous as Date | null);
            return seen.length === 1 ? first : second;
          },
        }
      );

      state.current = { a: 2 };

      // First write has no previous expiry; the second sees the one the first returned
      expect(seen[0]).toBeNull();
      expect(seen[1]).toEqual(first);
      expect(parse(localStorage.getItem('settings')!).expiry).toEqual(second);
    });
  });
});
