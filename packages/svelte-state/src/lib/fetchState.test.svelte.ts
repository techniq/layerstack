// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { FetchErrors, FetchState } from './fetchState.svelte.js';

function jsonResponse(body: any, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn(async () => jsonResponse({ ok: true }));
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('FetchState', () => {
  it('reports loading, then the parsed data', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ name: 'Ada' }));
    const state = new FetchState({});

    const promise = state.fetch('/api/user');
    expect(state.loading).toBe(true);

    await promise;

    expect(state.loading).toBe(false);
    expect(state.data).toEqual({ name: 'Ada' });
    expect(state.error).toBeUndefined();
    expect(state.request?.url).toBe('/api/user');
  });

  it('treats a non-ok response as an error and clears data', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'nope' }, { status: 400 }));
    const state = new FetchState({});

    await state.fetch('/api/user');

    expect(state.data).toBeUndefined();
    expect(state.error).toEqual({ message: 'nope' });
    expect(state.loading).toBe(false);
  });

  it('parses by `Content-Type`, falling back to text for html', async () => {
    fetchMock.mockResolvedValue(
      new Response('<p>hi</p>', { headers: { 'Content-Type': 'text/html' } })
    );
    const state = new FetchState({});

    await state.fetch('/page');

    expect(state.data).toBe('<p>hi</p>');
  });

  it('returns null for an empty response with no `Content-Type`', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    const state = new FetchState({});

    await state.fetch('/api/nothing');

    expect(state.data).toBeNull();
  });

  it('honors an explicit `as` body method', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ name: 'Ada' }));
    const state = new FetchState({});

    await state.fetch('/api/user', { as: 'text' });

    expect(state.data).toBe('{"name":"Ada"}');
  });

  it('skips a repeat of the identical request', async () => {
    const state = new FetchState({});

    await state.fetch('/api/user');
    await state.fetch('/api/user');

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('`force` bypasses the identical-request check', async () => {
    const state = new FetchState({});

    await state.fetch('/api/user');
    await state.fetch('/api/user', { force: true });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('`refresh` re-runs the last request', async () => {
    const state = new FetchState({});

    await state.fetch('/api/user');
    await state.refresh();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toBe('/api/user');
  });

  it('`disabled` makes no request at all', async () => {
    const state = new FetchState({});

    await state.fetch('/api/user', { disabled: true });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(state.loading).toBeUndefined();
  });

  it('`once` prevents a second load of a different url', async () => {
    const state = new FetchState({ once: true });

    await state.fetch('/api/user');
    await state.fetch('/api/other');

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('`clear` resets back to the initial state', async () => {
    const state = new FetchState({});
    await state.fetch('/api/user');

    state.clear();

    expect(state.data).toBeUndefined();
    expect(state.error).toBeUndefined();
    expect(state.loading).toBeUndefined();
    expect(state.response).toBeUndefined();
  });

  it('`onDataChange` can replace the data', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ count: 1 }));
    const state = new FetchState<{ count: number }>({
      onDataChange: (newData) => ({ count: newData.count * 10 }),
    });

    await state.fetch('/api/count');

    expect(state.data).toEqual({ count: 10 });
  });

  it('merges config `options` into the request', async () => {
    const state = new FetchState({ options: () => ({ headers: { 'X-Global': 'yes' } }) });

    await state.fetch('/api/user', { options: () => ({ method: 'POST' }) });

    const [, options] = fetchMock.mock.calls[0];
    expect(options.method).toBe('POST');
    expect(options.headers['X-Global']).toBe('yes');
    // The default `Content-Type` survives the merge
    expect(options.headers['Content-Type']).toBe('application/json');
  });

  it('ignores a response that arrives after a later one', async () => {
    let resolveFirst!: (r: Response) => void;
    fetchMock
      .mockImplementationOnce(() => new Promise<Response>((resolve) => (resolveFirst = resolve)))
      .mockImplementationOnce(async () => jsonResponse({ which: 'second' }));

    const state = new FetchState({});

    const first = state.fetch('/api/one');
    const second = state.fetch('/api/two');

    await second;
    expect(state.data).toEqual({ which: 'second' });

    // The stale request finishes last, and must not overwrite the newer result
    resolveFirst(jsonResponse({ which: 'first' }));
    await first;

    expect(state.data).toEqual({ which: 'second' });
  });

  describe('errors', () => {
    it('collects errors into the shared `FetchErrors`', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ message: 'nope' }, { status: 500 }));
      const errors = new FetchErrors();
      const state = new FetchState({ errors });

      await state.fetch('/api/user');

      expect(errors.current).toEqual([{ message: 'nope' }]);
    });

    it('`suppressErrors` keeps them out of the shared collection', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ message: 'nope' }, { status: 500 }));
      const errors = new FetchErrors();
      const state = new FetchState({ errors, suppressErrors: true });

      await state.fetch('/api/user');

      expect(errors.current).toEqual([]);
      expect(state.error).toEqual({ message: 'nope' });
    });

    it('removes its own errors on dispose, leaving other instances alone', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ message: 'a' }, { status: 500 }));
      const errors = new FetchErrors();

      const first = new FetchState({ errors });
      await first.fetch('/api/a');

      fetchMock.mockResolvedValue(jsonResponse({ message: 'b' }, { status: 500 }));
      const second = new FetchState({ errors });
      await second.fetch('/api/b');

      expect(errors.current).toHaveLength(2);

      first.dispose();

      expect(errors.current).toEqual([{ message: 'b' }]);
    });

    it('clears its previous errors when starting a new request', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ message: 'a' }, { status: 500 }));
      const errors = new FetchErrors();
      const state = new FetchState({ errors });

      await state.fetch('/api/a');
      await state.fetch('/api/b');

      expect(errors.current).toHaveLength(1);
    });
  });
});
