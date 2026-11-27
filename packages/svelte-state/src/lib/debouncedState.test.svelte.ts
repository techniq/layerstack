// @vitest-environment happy-dom
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DebouncedState } from './debouncedState.svelte.js';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('DebouncedState', () => {
  it('starts at the current value rather than empty', () => {
    const cleanup = $effect.root(() => {
      let source = $state('initial');
      const debounced = new DebouncedState(() => source);

      expect(debounced.current).toBe('initial');
      expect(debounced.pending).toBe(false);
    });
    cleanup();
  });

  it('adopts a new value only after the delay', () => {
    const cleanup = $effect.root(() => {
      let source = $state('a');
      const debounced = new DebouncedState(() => source, 300);
      flushSync();

      source = 'b';
      flushSync();

      expect(debounced.current).toBe('a');
      expect(debounced.pending).toBe(true);

      vi.advanceTimersByTime(299);
      expect(debounced.current).toBe('a');

      vi.advanceTimersByTime(1);
      flushSync();
      expect(debounced.current).toBe('b');
      expect(debounced.pending).toBe(false);
    });
    cleanup();
  });

  it('restarts the delay on each change, so only the last value lands', () => {
    const cleanup = $effect.root(() => {
      let source = $state('a');
      const debounced = new DebouncedState(() => source, 300);
      flushSync();

      source = 'b';
      flushSync();
      vi.advanceTimersByTime(200);

      source = 'c';
      flushSync();
      vi.advanceTimersByTime(200);

      // 400ms since 'b', but only 200ms since 'c'
      expect(debounced.current).toBe('a');

      vi.advanceTimersByTime(100);
      flushSync();
      expect(debounced.current).toBe('c');
    });
    cleanup();
  });

  it('settles nothing when the value changes back within the delay', () => {
    const cleanup = $effect.root(() => {
      let source = $state('a');
      const debounced = new DebouncedState(() => source, 300);
      flushSync();

      source = 'b';
      flushSync();
      expect(debounced.pending).toBe(true);

      source = 'a';
      flushSync();
      expect(debounced.pending).toBe(false);

      vi.advanceTimersByTime(300);
      flushSync();
      expect(debounced.current).toBe('a');
    });
    cleanup();
  });

  it('cancels a pending update when torn down', () => {
    let debounced: DebouncedState<string>;

    const cleanup = $effect.root(() => {
      let source = $state('a');
      debounced = new DebouncedState(() => source, 300);
      flushSync();

      source = 'b';
      flushSync();
    });

    cleanup();

    vi.advanceTimersByTime(300);
    expect(debounced!.current).toBe('a');
  });
});
