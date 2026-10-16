import { getContext, setContext } from 'svelte';
import { merge, parse, stringify } from '@layerstack/utils';

import { FetchState, initFetchClient } from './fetchState.svelte.js';
import type { FetchConfig } from './fetchState.svelte.js';

export type GraphClientConfig = {
  url: string;
  config?: FetchConfig;
};

export type GraphQLError = {
  message: string;
  extensions?: any;
};

const CONTEXT_KEY = Symbol();

/** Provide the endpoint and default config for every `GraphState` created below this component */
export function initGraphClient(config: GraphClientConfig) {
  setContext(CONTEXT_KEY, config);
  initFetchClient(config.config ?? {});
}

export type QueryConfig = {
  query: string;
  variables?: any;
  config?: FetchConfig;
};

/**
 * Reactive GraphQL request state, built on {@link FetchState}.
 *
 * Mutations are never skipped as duplicates — the same mutation sent twice is two distinct
 * operations, unlike a repeated query.
 */
export class GraphState<TData = any> {
  #clientConfig: GraphClientConfig;
  #fetchState: FetchState<TData>;
  #baseQueryConfig: QueryConfig | undefined;
  #queryConfig: QueryConfig | undefined = $state();

  constructor(baseQueryConfig?: QueryConfig, clientConfig?: GraphClientConfig) {
    this.#clientConfig = clientConfig ??
      getContext<GraphClientConfig>(CONTEXT_KEY) ?? { url: '/graphql' };
    this.#baseQueryConfig = baseQueryConfig;
    this.#queryConfig = baseQueryConfig;
    // Pass the config explicitly — it is already resolved, and an `undefined` would send
    // `FetchState` back to context, which is unavailable outside component initialization
    this.#fetchState = new FetchState<TData>(this.#clientConfig.config ?? {});
  }

  get loading() {
    return this.#fetchState.loading;
  }

  get data() {
    return this.#fetchState.data;
  }

  get error() {
    return this.#fetchState.error;
  }

  get request() {
    return this.#fetchState.request;
  }

  get response() {
    return this.#fetchState.response;
  }

  get fetchConfig() {
    return this.#fetchState.fetchConfig;
  }

  /** The merged query config of the most recent request, for building derived requests (ex. exports) */
  get queryConfig() {
    return this.#queryConfig;
  }

  fetch = (queryConfig?: QueryConfig) => {
    const mergedQueryConfig = merge({}, this.#baseQueryConfig, queryConfig) as QueryConfig;
    this.#queryConfig = mergedQueryConfig;

    const { query, variables, config } = mergedQueryConfig;

    // https://github.com/apollographql/graphql-tag/issues/144
    const isMutation = query.toLowerCase().includes('mutation');

    const options: RequestInit = merge(
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: stringify({ query, variables }),
      },
      this.#clientConfig.config?.options?.(),
      config?.options?.()
    );

    const mergedFetchConfig: FetchConfig = merge(
      { force: isMutation ? true : undefined } as FetchConfig,
      this.#clientConfig.config,
      {
        as: async (res: Response) => {
          // Use custom JSON reviver to convert Date strings to Date objects
          const text = await res.text();
          const body = parse(text);
          if (body.errors) {
            throw body.errors;
          } else {
            return body.data;
          }
        },
        options: () => options,
      } as FetchConfig,
      config
    );

    return this.#fetchState.fetch(this.#clientConfig.url, mergedFetchConfig);
  };

  refresh = () => this.#fetchState.refresh();

  clear = () => this.#fetchState.clear();

  dispose = () => this.#fetchState.dispose();
}

/** Tag template literal for GraphQL queries — purely for editor tooling, it just joins the string */
export function gql(strings: TemplateStringsArray, ...args: any[]) {
  return strings.map((s, i) => (i === strings.length - 1 ? `${s}` : `${s}${args[i]}`)).join('');
}
