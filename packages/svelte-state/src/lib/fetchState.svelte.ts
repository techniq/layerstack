import { getContext, setContext } from 'svelte';
import { merge } from '@layerstack/utils';

type BodyMethods = 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text';

type ResponseMapping = { [mimeType: string]: (res: Response) => Promise<any> };

/**
 * Collects errors across many `FetchState` instances, so an app can surface them in one place.
 * Errors are removed again when the instance that produced them is cleaned up.
 */
export class FetchErrors {
  #current: any[] = $state([]);

  get current() {
    return this.#current;
  }

  add(error: any) {
    if (Array.isArray(error)) {
      this.#current.push(...error);
    } else {
      this.#current.push(error);
    }
  }

  remove(errors: any[]) {
    this.#current = this.#current.filter((e) => !errors.includes(e));
  }

  clear() {
    this.#current = [];
  }
}

export type FetchConfig<TData = any> = {
  options?: () => RequestInit;
  disabled?: boolean;
  force?: boolean;
  as?: 'auto' | BodyMethods | ((response: Response) => Promise<any>) | ResponseMapping;
  onDataChange?: (newData: TData, data: TData) => any;
  onResponseChange?: (response: Response, state: FetchSnapshot<TData>) => any;
  once?: boolean;

  /**
   * Collects all errors.  Useful to handle errors consistently across an app.  Typically passed
   * via `initFetchClient`.
   */
  errors?: FetchErrors;

  /** Do not pass errors up to context */
  suppressErrors?: boolean;
};

const CONTEXT_KEY = Symbol();

/** Provide the default `FetchConfig` for every `FetchState` created below this component */
export function initFetchClient(config: FetchConfig<any>) {
  setContext(CONTEXT_KEY, config);
}

export type FetchRequest = { url: string; options: RequestInit };

/** A plain snapshot of a `FetchState`, as handed to `onResponseChange` */
export type FetchSnapshot<TData = any> = {
  loading: boolean | undefined;
  data: TData | undefined;
  error: any;
  request: FetchRequest | undefined;
  response: Response | undefined;
};

export const defaultOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const DEFAULT_SNAPSHOT: FetchSnapshot = {
  loading: undefined,
  data: undefined,
  error: undefined,
  request: undefined,
  response: undefined,
};

/**
 * Reactive `fetch` state — tracks `loading`, `data`, `error`, `request`, and `response` for the
 * most recent request, skipping repeat requests and ignoring responses that arrive out of order.
 */
export class FetchState<TData = any> {
  #globalConfig: FetchConfig | undefined;
  #localErrors: any[] = [];

  #loading: boolean | undefined = $state();
  #data: TData | undefined = $state();
  #error: any = $state();
  #request: FetchRequest | undefined = $state();
  #response: Response | undefined = $state();

  /** Track first data load for `once` */
  #loaded = false;
  #promises: Promise<any>[] = [];

  #fetchConfig: { url: string; config?: FetchConfig } = $state({ url: '' });

  /**
   * @param config Defaults for every request.  Falls back to the config from `initFetchClient`
   *   when omitted, which requires constructing during component initialization.
   */
  constructor(config?: FetchConfig<TData>) {
    this.#globalConfig = config ?? getContext<FetchConfig>(CONTEXT_KEY);
  }

  get loading() {
    return this.#loading;
  }

  get data() {
    return this.#data;
  }

  get error() {
    return this.#error;
  }

  get request() {
    return this.#request;
  }

  get response() {
    return this.#response;
  }

  /** The url and merged config of the most recent request, for building derived requests */
  get fetchConfig() {
    return this.#fetchConfig;
  }

  #snapshot(): FetchSnapshot<TData> {
    return {
      loading: this.#loading,
      data: this.#data,
      error: this.#error,
      request: this.#request,
      response: this.#response,
    };
  }

  fetch = (url: string, config?: FetchConfig<TData>) => {
    const mergedConfig: FetchConfig = merge({}, this.#globalConfig, config);

    const prevFetchConfig = this.#fetchConfig;

    // Save for refreshing or other building derived requests (ex. exports)
    this.#fetchConfig = { url, config: mergedConfig };

    if (
      mergedConfig?.disabled === true ||
      (mergedConfig?.once && this.#loaded && mergedConfig?.force !== true)
    ) {
      // disabled or request already loaded and `once` set (and not forced) - do nothing
      return;
    }

    if (
      mergedConfig?.force !== true &&
      url === prevFetchConfig.url &&
      mergedConfig?.options?.().body === prevFetchConfig?.config?.options?.().body &&
      mergedConfig?.disabled === prevFetchConfig?.config?.disabled
    ) {
      // skip identical request as last unless force enabled
      return;
    }

    const options: RequestInit = merge(
      {},
      defaultOptions,
      this.#globalConfig?.options?.(),
      config?.options?.()
    );

    const request = { url, options };

    // Remove local errors from the shared collection and clear them when loading a new request
    this.#removeGlobalErrors();
    this.#localErrors = [];

    this.#apply({ request, loading: true }, null, mergedConfig);

    const as = mergedConfig?.as || 'auto';

    const promise = fetch(url, options)
      .then(async (response) => {
        const dataPromise =
          typeof as === 'function'
            ? as(response)
            : typeof as === 'object'
              ? parseBody(response, as)
              : as === 'auto'
                ? parseBody(response)
                : response[as]();

        try {
          const data = await dataPromise;

          this.#apply(
            {
              request,
              loading: false,
              data: response.ok ? data : undefined, // Clear last response
              error: response.ok ? undefined : data,
              response,
            },
            promise,
            mergedConfig
          );
          this.#loaded = true;
        } catch (error) {
          this.#apply(
            {
              request,
              loading: false,
              data: undefined, // Clear last response
              error,
              response,
            },
            promise,
            mergedConfig
          );
        }
      })
      .catch((error) => {
        // Catch request errors with no response (CORS issues, etc)
        this.#apply({ request, data: undefined, error, loading: false }, promise, mergedConfig);

        // Rethrow so not to swallow errors, especially from errors within handlers
        throw error;
      });

    this.#promises.push(promise);

    return promise;
  };

  #apply(
    nextState: Partial<FetchSnapshot<TData>>,
    currentPromise: Promise<any> | null,
    config?: FetchConfig
  ) {
    if (currentPromise) {
      // Handle (i.e. ignore) promises resolved out of order from requests
      const index = this.#promises.indexOf(currentPromise);
      if (index === -1) {
        // Ignore update as a later request/promise has already been processed
        return;
      }

      // Remove currently resolved promise and any outstanding promises
      // (which will cause them to be ignored when they do resolve/reject)
      this.#promises.splice(0, index + 1);
    }

    let data = undefined;
    if (nextState.data && nextState.data !== this.#data && config?.onDataChange) {
      try {
        data = config.onDataChange(nextState.data, this.#data as TData);
      } catch (err) {
        console.error(err);
      }
    }

    const previousResponse = this.#response;

    if ('loading' in nextState) this.#loading = nextState.loading;
    if ('request' in nextState) this.#request = nextState.request;
    if ('response' in nextState) this.#response = nextState.response;
    if ('error' in nextState) this.#error = nextState.error;
    if ('data' in nextState) this.#data = nextState.data;

    // If `onDataChange` returned a value, use it as the data
    if (data !== undefined) {
      this.#data = data;
    }

    if (nextState.response && nextState.response !== previousResponse && config?.onResponseChange) {
      try {
        data = config.onResponseChange(nextState.response, this.#snapshot());
      } catch (err) {
        console.error(err);
      }

      // If `onResponseChange` returned a value, use it as the data
      if (data !== undefined) {
        this.#data = data;
      }
    }

    // Only when this update carries an error.  Otherwise the `loading: true` update, which retains
    // the previous error, would re-add it on every request and the collection would only grow
    if ('error' in nextState && this.#error && config?.suppressErrors !== true) {
      this.#globalConfig?.errors?.add(this.#error);

      // Track errors for this instance too, so they can be removed from the shared collection
      if (Array.isArray(this.#error)) {
        this.#localErrors.push(...this.#error);
      } else {
        this.#localErrors.push(this.#error);
      }
    }
  }

  #removeGlobalErrors() {
    this.#globalConfig?.errors?.remove(this.#localErrors);
  }

  /** Re-run the most recent request, bypassing the identical-request check */
  refresh = () => {
    const { url, config } = this.#fetchConfig;
    return this.fetch(url, { ...config, force: true });
  };

  /** Reset to the initial state, keeping the last request config for `refresh()` */
  clear = () => {
    const { config } = this.#fetchConfig;
    this.#apply({ ...DEFAULT_SNAPSHOT } as Partial<FetchSnapshot<TData>>, null, config);
  };

  /**
   * Remove this instance's errors from the shared collection.  The store did this automatically on
   * unsubscribe; wire it up with `$effect(() => state.dispose)` where that matters.
   */
  dispose = () => {
    this.#removeGlobalErrors();
  };
}

function parseBody(response: Response, mapping: ResponseMapping = {}) {
  const contentType = response.headers.get('Content-Type');

  // Do not attempt to parse empty response
  if (contentType === null) {
    return Promise.resolve(null);
  }

  const mimeType = contentType.split(';')[0].trim();

  if (mimeType in mapping) {
    // Direct mapping of `Content-Type`/`mimeType` to response handler
    return mapping[mimeType](response);
  } else if (
    mimeType === 'application/json' ||
    mimeType === 'text/json' ||
    /\+json$/.test(mimeType) // ends with "+json"
  ) {
    // https://mimesniff.spec.whatwg.org/#json-mime-type
    return 'json' in mapping ? mapping['json'](response) : response.json();
  } else if (mimeType === 'text/html') {
    // https://mimesniff.spec.whatwg.org/#html-mime-type
    return 'html' in mapping ? mapping['html'](response) : response.text();
  } else if (
    mimeType === 'application/xml' ||
    mimeType === 'text/xml' ||
    /\+xml$/.test(mimeType) // ends with "+xml"
  ) {
    // https://mimesniff.spec.whatwg.org/#xml-mime-type
    return 'xml' in mapping ? mapping['xml'](response) : response.text();
  } else {
    return 'other' in mapping ? mapping['other'](response) : response.arrayBuffer();
  }
}
