// @vitest-environment happy-dom
import { flushSync } from 'svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { QueryParamState, QueryParamsState } from './queryParamsState.svelte.js';

/** Stands in for `page` from `$app/state` — reactive, so reads re-run on navigation */
function reactivePage(href: string) {
  const page = $state({ url: new URL(href) });
  return page;
}

beforeEach(() => {
  window.history.replaceState({}, '', 'http://localhost:3000/');
});

describe('QueryParamState', () => {
  it('decodes a single param by its type', () => {
    const page = reactivePage('http://localhost:3000/?count=5');
    const state = new QueryParamState<number>({ name: 'count', page, paramType: 'number' });

    expect(state.current).toBe(5);
  });

  it('falls back to the default when the param is absent', () => {
    const page = reactivePage('http://localhost:3000/');
    const state = new QueryParamState<number>({
      name: 'count',
      page,
      paramType: 'number',
      default: 10,
    });

    expect(state.current).toBe(10);
  });

  it('re-reads when the page url changes', () => {
    const cleanup = $effect.root(() => {
      const page = reactivePage('http://localhost:3000/?count=5');
      const state = new QueryParamState<number>({ name: 'count', page, paramType: 'number' });

      expect(state.current).toBe(5);

      page.url = new URL('http://localhost:3000/?count=9');
      flushSync();

      expect(state.current).toBe(9);
    });
    cleanup();
  });

  it('decodes an array param', () => {
    const page = reactivePage('http://localhost:3000/?tags=a_b_c');
    const state = new QueryParamState<string[]>({ name: 'tags', page, paramType: 'string[]' });

    expect(state.current).toEqual(['a', 'b', 'c']);
  });

  it('writes through `goto`', () => {
    const page = reactivePage('http://localhost:3000/?count=5');
    const goto = vi.fn();
    const state = new QueryParamState<number>({ name: 'count', page, paramType: 'number', goto });

    state.current = 7;

    expect(goto).toHaveBeenCalledTimes(1);
    expect((goto.mock.calls[0][0] as URL).search).toBe('?count=7');
  });

  it('forwards `gotoOptions` rather than the page object', () => {
    const page = reactivePage('http://localhost:3000/');
    const goto = vi.fn();
    const state = new QueryParamState<number>({
      name: 'count',
      page,
      paramType: 'number',
      goto,
      gotoOptions: { replaceState: true },
    });

    state.current = 7;

    expect(goto.mock.calls[0][1]).toEqual({ replaceState: true });
  });

  it('warns rather than throwing when `goto` was not provided', () => {
    const page = reactivePage('http://localhost:3000/');
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const state = new QueryParamState<number>({ name: 'count', page, paramType: 'number' });

    state.current = 7;

    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  it('drops a param set back to its default', () => {
    const page = reactivePage('http://localhost:3000/?count=5');
    const params = new URLSearchParams('count=5');
    const state = new QueryParamState<number>({
      name: 'count',
      page,
      paramType: 'number',
      default: 10,
    });

    state.apply(params, 10);

    expect(params.has('count')).toBe(false);
  });
});

describe('QueryParamsState', () => {
  const paramTypes = { count: 'number', tags: 'string[]', active: 'boolean' } as const;

  it('reads every param into one object', () => {
    const page = reactivePage('http://localhost:3000/?count=5&tags=a_b&active=1');
    const state = new QueryParamsState({ page, paramTypes: paramTypes as any });

    expect(state.current).toEqual({ count: 5, tags: ['a', 'b'], active: true });
  });

  it('merges defaults for params not present in the url', () => {
    const page = reactivePage('http://localhost:3000/?count=5');
    const state = new QueryParamsState({
      page,
      defaults: { count: 1, tags: ['x'] },
      paramTypes: paramTypes as any,
    });

    expect(state.current).toEqual({ count: 5, tags: ['x'] });
  });

  it('supports `paramTypes` as a function', () => {
    const page = reactivePage('http://localhost:3000/?count=5');
    const state = new QueryParamsState({
      page,
      paramTypes: (key) => (key === 'count' ? 'number' : 'string'),
    });

    expect(state.current).toEqual({ count: 5 });
  });

  it('recomputes when the page url changes', () => {
    const cleanup = $effect.root(() => {
      const page = reactivePage('http://localhost:3000/?count=5');
      const state = new QueryParamsState({ page, paramTypes: paramTypes as any });

      expect(state.current).toEqual({ count: 5 });

      page.url = new URL('http://localhost:3000/?count=6&active=1');
      flushSync();

      expect(state.current).toEqual({ count: 6, active: true });
    });
    cleanup();
  });

  it('builds params, omitting defaults and empty values', () => {
    const page = reactivePage('http://localhost:3000/');
    const state = new QueryParamsState({
      page,
      defaults: { count: 1 },
      paramTypes: paramTypes as any,
    });

    const params = state.createParams({ count: 1, tags: [], active: true } as any);

    expect(params?.has('count')).toBe(false); // equals the default
    expect(params?.has('tags')).toBe(false); // empty array
    expect(params?.get('active')).toBe('1');
  });

  it('replaces the whole querystring when set', () => {
    window.history.replaceState({}, '', 'http://localhost:3000/?stale=yes');
    const page = reactivePage('http://localhost:3000/?stale=yes');
    const goto = vi.fn();
    const state = new QueryParamsState({ page, goto, paramTypes: paramTypes as any });

    state.current = { count: 3 } as any;

    const url = goto.mock.calls[0][0] as URL;
    expect(url.search).toBe('?count=3');
    expect(url.searchParams.has('stale')).toBe(false);
  });
});
