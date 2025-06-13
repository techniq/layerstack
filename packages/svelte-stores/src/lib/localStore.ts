import { writable } from 'svelte/store';

import { parse, stringify } from '@layerstack/utils';
import { browser } from '@layerstack/utils/env';
import { expireObject } from '@layerstack/utils/object';
import type { Expiry } from '@layerstack/utils/object';

type LocalStoreOptions<Value> = {
  expiry?: Expiry | ((previousExpiry: Expiry | undefined | null) => Expiry);
  override?: Value;
};

function localStore<Value>(key: string, initialValue: Value, options?: LocalStoreOptions<Value>) {
  let value = initialValue;
  let previousExpiry: Expiry | null = null;

  if (options?.override != null) {
    value = options?.override;
  } else {
    const storedValue = browser ? localStorage.getItem(key) : null;
    if (storedValue !== null) {
      const decodedValue = parse(storedValue);
      if (options?.expiry) {
        // TODO: If object returned, merge with initialValue (sub-properties)?
        // @ts-expect-error
        value = expireObject<Value>(decodedValue.value, decodedValue.expiry) ?? initialValue;
        previousExpiry = decodedValue.expiry;
      } else {
        value = decodedValue;
      }
    }
  }

  const store = writable<Value>(value);

  if (browser) {
    store.subscribe((val) => {
      if (options?.expiry) {
        // Remove all expired expiry
        const prunedPreviousExpiry = previousExpiry
          ? expireObject(previousExpiry, previousExpiry)
          : previousExpiry;

        const expiry =
          typeof options?.expiry === 'function'
            ? // @ts-expect-error
              options?.expiry(prunedPreviousExpiry) // Update expiry on write
            : options?.expiry;
        previousExpiry = expiry;

        localStorage.setItem(key, stringify({ value: val, expiry }));
      } else {
        localStorage.setItem(key, stringify(val));
      }
    });
  }

  return store;
}

export default localStore;
