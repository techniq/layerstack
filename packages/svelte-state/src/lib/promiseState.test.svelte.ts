// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';

import { PromiseState } from './promiseState.svelte.js';

/** A promise plus the handles to settle it, so tests control the timing */
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: any) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('PromiseState', () => {
  it('starts idle with no promise', () => {
    const state = new PromiseState<number>();

    expect(state.loading).toBe(false);
    expect(state.data).toBeUndefined();
    expect(state.error).toBeUndefined();
  });

  it('reports loading while pending, then the data', async () => {
    const { promise, resolve } = deferred<number>();
    const state = new PromiseState<number>();

    const settled = state.setPromise(promise);
    // Let the `Promise.race` against WAITING resolve
    await Promise.resolve();
    await Promise.resolve();
    expect(state.loading).toBe(true);

    resolve(42);
    await settled;

    expect(state.loading).toBe(false);
    expect(state.data).toBe(42);
    expect(state.error).toBeUndefined();
  });

  it('never flips to loading for an already-resolved promise', async () => {
    const state = new PromiseState<number>();

    await state.setPromise(Promise.resolve(42));

    expect(state.loading).toBe(false);
    expect(state.data).toBe(42);
  });

  it('captures rejections', async () => {
    const state = new PromiseState<number>();

    await state.setPromise(Promise.reject(new Error('boom')));

    expect(state.loading).toBe(false);
    expect(state.data).toBeUndefined();
    expect(state.error?.message).toBe('boom');
    expect(state.aborted).toBe(false);
  });

  it('flags an AbortError as aborted', async () => {
    const state = new PromiseState<number>();
    const error = new Error('cancelled');
    error.name = 'AbortError';

    await state.setPromise(Promise.reject(error));

    expect(state.aborted).toBe(true);
  });

  it('resets when given no promise', async () => {
    const state = new PromiseState<number>();
    await state.setPromise(Promise.resolve(42));

    await state.setPromise(undefined);

    expect(state.data).toBeUndefined();
    expect(state.loading).toBe(false);
  });

  it('ignores a superseded promise, even when it resolves last', async () => {
    const first = deferred<string>();
    const second = deferred<string>();
    const state = new PromiseState<string>();

    const firstSettled = state.setPromise(first.promise);
    const secondSettled = state.setPromise(second.promise);

    // The superseded request finishes after the one that replaced it
    second.resolve('second');
    await secondSettled;
    first.resolve('first');
    await firstSettled;

    expect(state.data).toBe('second');
  });

  it('ignores a rejection from a superseded promise', async () => {
    const first = deferred<string>();
    const second = deferred<string>();
    const state = new PromiseState<string>();

    const firstSettled = state.setPromise(first.promise);
    const secondSettled = state.setPromise(second.promise);

    second.resolve('second');
    await secondSettled;
    first.reject(new Error('stale failure'));
    await firstSettled;

    expect(state.data).toBe('second');
    expect(state.error).toBeUndefined();
  });

  it('adopts an initial promise passed to the constructor', async () => {
    const state = new PromiseState(Promise.resolve('ready'));

    // Allow the constructor's `setPromise` to settle
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(state.data).toBe('ready');
  });
});
