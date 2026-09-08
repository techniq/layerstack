import * as Serialize from '@layerstack/utils/serialize';
import rollup from '@layerstack/utils/rollup';
import { entries, isEqual, type ValueOf } from '@layerstack/utils';

// Matches $app/navigation's goto without taking a dependency on SvelteKit
type Goto = (url: string | URL, opts?: any) => any;

// Structural, so `page` from `$app/state` fits without importing `@sveltejs/kit`
type PageLike = { url: URL };

export type ParamType =
  | 'string'
  | 'string[]'
  | 'number'
  | 'number[]'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'json'
  | 'object';

export type QueryParamOptions<Value> = {
  name: string;

  /** The reactive `page` object, typically from `$app/state` */
  page: PageLike;

  default?: Value;
  paramType?: ParamType;

  /** `goto` from `$app/navigation`.  Required to write the value back to the URL */
  goto?: Goto;

  /** Options forwarded to `goto` (ex. `{ replaceState: true, noScroll: true }`) */
  gotoOptions?: any;
};

/**
 * A single querystring param as reactive state.  Reads through the reactive `page`, so it updates
 * on navigation, including back/forward.
 */
export class QueryParamState<Value> {
  #options: QueryParamOptions<Value>;

  constructor(options: QueryParamOptions<Value>) {
    this.#options = options;
  }

  get current(): Value | undefined {
    const values = this.#options.page.url.searchParams.getAll(this.#options.name);
    return (decodeParam(values, this.#options.paramType) ?? this.#options.default) as
      | Value
      | undefined;
  }

  set current(value: Value) {
    if (this.#options.goto === undefined) {
      console.error('`goto` must be passed to allow setting the URL');
      return;
    }

    const url = new URL(window.location.href);
    this.apply(url.searchParams, value);
    this.#options.goto(url, this.#options.gotoOptions);
  }

  /** Apply a new value to existing `URLSearchParams` */
  apply = (params: URLSearchParams, newValue: Value) => {
    // Do not update the querystring during SSR
    if (typeof window !== 'undefined') {
      applyParam(
        params,
        this.#options.name,
        newValue,
        this.#options.default,
        this.#options.paramType
      );
    }
  };
}

export type QueryParamsOptions<Values> = {
  /** The reactive `page` object, typically from `$app/state` */
  page: PageLike;

  defaults?: Values;
  paramTypes?: { [key: string]: ParamType } | ((key: keyof Values) => ParamType);

  /** `goto` from `$app/navigation`.  Required to write values back to the URL */
  goto?: Goto;

  /** Options forwarded to `goto` (ex. `{ replaceState: true, noScroll: true }`) */
  gotoOptions?: any;
};

/**
 * All querystring params as a single reactive object, one property per param.
 *
 * Setting `current` replaces the whole querystring — this owns it — so params equal to their
 * default, `null`, or an empty array are dropped rather than written out.
 */
export class QueryParamsState<Values extends { [key: string]: any }> {
  #options: QueryParamsOptions<Values>;

  #current: Values = $derived.by(() => {
    const state = { ...this.#options.defaults } as Values;

    // Group by key
    const groupedParams: Map<keyof Values, ValueOf<Values>> = rollup(
      [...this.#options.page.url.searchParams],
      (items) => items.map((x) => x[1]),
      [([key]) => key]
    );

    for (const [key, values] of groupedParams) {
      const paramType = this.#paramType(key);
      (state as any)[key.toString()] = decodeParam(values, paramType);
    }

    return state;
  });

  constructor(options: QueryParamsOptions<Values>) {
    this.#options = options;
  }

  #paramType(key: keyof Values) {
    return typeof this.#options.paramTypes === 'function'
      ? this.#options.paramTypes(key)
      : this.#options.paramTypes?.[key as string];
  }

  get current() {
    return this.#current;
  }

  set current(values: Values) {
    if (this.#options.goto === undefined) {
      console.error('`goto` must be passed to allow setting the URL');
      return;
    }

    const url = this.createUrl(values);
    if (url) {
      this.#options.goto(url, this.#options.gotoOptions);
    }
  }

  /** Create new `URLSearchParams` from values and the `paramTypes` mapping */
  createParams = (newValues: Values) => {
    // Do not update the querystring during SSR
    if (typeof window === 'undefined') {
      return undefined;
    }

    // This owns the full querystring, so start fresh
    const params = new URLSearchParams();

    if (newValues != null) {
      entries(newValues).forEach(([key, value]) => {
        applyParam(
          params,
          key as string,
          value,
          this.#options.defaults?.[key],
          this.#paramType(key)
        );
      });
    }

    return params;
  };

  createUrl = (newValues: Values) => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const params = this.createParams(newValues);
    const url = new URL(window.location.href);
    url.search = params?.toString() ?? '';
    return url;
  };
}

function applyParam(
  params: URLSearchParams,
  key: string,
  value: any,
  defaultValue: any,
  paramType?: ParamType
) {
  if (
    isEqual(defaultValue, value) ||
    value == null ||
    (Array.isArray(value) && value.length === 0)
  ) {
    params.delete(key);
  } else if (paramType) {
    const config = getParamConfig(paramType);
    if (config) {
      // TODO: Add `ParamType` which calls `params.append()` for each value instead of encoding together
      params.set(key, config.encode(value as never) ?? '');
    }
  }
}

function decodeParam(values: string[], paramType?: ParamType) {
  if (paramType) {
    const config = getParamConfig(paramType);
    return config.decode(values);
  } else {
    return null;
  }
}

export function getParamConfig(paramType: ParamType) {
  switch (paramType) {
    case 'string':
      return {
        encode: Serialize.encodeString,
        decode: Serialize.decodeString,
      };
    case 'string[]':
      return {
        encode: Serialize.encodeDelimitedArray,
        decode: Serialize.decodeDelimitedArray,
      };
    case 'number':
      return {
        encode: Serialize.encodeNumber,
        decode: Serialize.decodeNumber,
      };
    case 'number[]':
      return {
        encode: Serialize.encodeDelimitedNumericArray,
        decode: Serialize.decodeDelimitedNumericArray,
      };
    case 'boolean':
      return {
        encode: Serialize.encodeBoolean,
        decode: Serialize.decodeBoolean,
      };
    case 'date':
      return {
        encode: Serialize.encodeDate,
        decode: Serialize.decodeDate,
      };
    case 'datetime':
      return {
        encode: Serialize.encodeDateTime,
        decode: Serialize.decodeDateTime,
      };
    case 'json':
      return {
        encode: Serialize.encodeJson,
        decode: Serialize.decodeJson,
      };
    case 'object':
      return {
        encode: Serialize.encodeObject,
        decode: Serialize.decodeObject,
      };
    default:
      throw new Error('No param config found');
  }
}
