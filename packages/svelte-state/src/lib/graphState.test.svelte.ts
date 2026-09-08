// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GraphState, gql } from './graphState.svelte.js';

function graphResponse(body: any) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn(async () => graphResponse({ data: null }));
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const client = { url: '/graphql' };

describe('gql', () => {
  it('joins the template into a plain string', () => {
    const name = 'user';
    expect(gql`query { ${name} { id } }`).toBe('query { user { id } }');
  });
});

describe('GraphState', () => {
  it('posts the query and unwraps `data`', async () => {
    fetchMock.mockResolvedValue(graphResponse({ data: { user: { id: 1 } } }));
    const state = new GraphState({ query: 'query { user { id } }' }, client);

    await state.fetch();

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe('/graphql');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body).query).toBe('query { user { id } }');
    expect(state.data).toEqual({ user: { id: 1 } });
    expect(state.error).toBeUndefined();
  });

  it('sends variables merged over the base query config', async () => {
    const state = new GraphState(
      { query: 'query ($id: ID!) { user(id: $id) { id } }', variables: { id: 1 } },
      client
    );

    await state.fetch({ query: 'query ($id: ID!) { user(id: $id) { id } }', variables: { id: 2 } });

    expect(JSON.parse(fetchMock.mock.calls[0][1].body).variables).toEqual({ id: 2 });
    expect(state.queryConfig?.variables).toEqual({ id: 2 });
  });

  it('surfaces GraphQL errors as an error rather than data', async () => {
    fetchMock.mockResolvedValue(graphResponse({ errors: [{ message: 'Not authorized' }] }));
    const state = new GraphState({ query: 'query { secret }' }, client);

    await state.fetch();

    expect(state.data).toBeUndefined();
    expect(state.error).toEqual([{ message: 'Not authorized' }]);
  });

  it('skips a repeated query, as `FetchState` would', async () => {
    const state = new GraphState({ query: 'query { user { id } }' }, client);

    await state.fetch();
    await state.fetch();

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('never skips a mutation — sending it twice is two operations', async () => {
    const state = new GraphState({ query: 'mutation { addUser { id } }' }, client);

    await state.fetch();
    await state.fetch();

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('sends JSON, not the `application/json.js` the store built', async () => {
    const state = new GraphState({ query: 'query { user { id } }' }, client);

    await state.fetch();

    expect(fetchMock.mock.calls[0][1].headers['Content-Type']).toBe('application/json');
  });

  it('`clear` resets the underlying fetch state', async () => {
    fetchMock.mockResolvedValue(graphResponse({ data: { user: { id: 1 } } }));
    const state = new GraphState({ query: 'query { user { id } }' }, client);
    await state.fetch();

    state.clear();

    expect(state.data).toBeUndefined();
  });
});
