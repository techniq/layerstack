import { parse, stringify } from '@layerstack/utils';
import { browser } from '@layerstack/utils/env';
import { expireObject } from '@layerstack/utils/object';
import type { Expiry } from '@layerstack/utils/object';

export type LocalStateOptions<Value> = {
  /**
   * Expire stored values.  Either an `Expiry` applied on every write, or a function receiving the
   * previous expiry (with anything already expired pruned) to derive the next one.
   */
  expiry?: Expiry | ((previousExpiry: Expiry | undefined | null) => Expiry);

  /** Use this value instead of anything stored, and do not read `localStorage` */
  override?: Value;
};

/**
 * State backed by `localStorage`.  Reads once on construction and writes on every change.
 *
 * Server-side there is no `localStorage`, so the initial value is used and nothing is persisted.
 */
export class LocalState<Value> {
  #key: string;
  #initial: Value;
  #options: LocalStateOptions<Value>;
  #previousExpiry: Expiry | null = null;
  #current: Value = $state()!;

  constructor(key: string, initialValue: Value, options: LocalStateOptions<Value> = {}) {
    this.#key = key;
    this.#initial = initialValue;
    this.#options = options;

    this.#current = this.#read();

    // Match the store's behavior, whose `subscribe` fired immediately and so wrote on creation
    this.#write(this.#current);
  }

  #read(): Value {
    if (this.#options.override != null) {
      return this.#options.override;
    }

    const storedValue = browser ? localStorage.getItem(this.#key) : null;
    if (storedValue === null) {
      return this.#initial;
    }

    const decodedValue = parse(storedValue);

    if (this.#options.expiry) {
      this.#previousExpiry = decodedValue.expiry;
      // TODO: If object returned, merge with initialValue (sub-properties)?
      // `expireObject` widens to `Partial<Value>` since it can drop expired keys
      return (
        (expireObject<Value>(decodedValue.value, decodedValue.expiry) as Value) ?? this.#initial
      );
    }

    return decodedValue;
  }

  #write(value: Value) {
    if (!browser) {
      return;
    }

    if (this.#options.expiry) {
      // Remove all expired expiry
      const prunedPreviousExpiry = this.#previousExpiry
        ? expireObject(this.#previousExpiry, this.#previousExpiry)
        : this.#previousExpiry;

      const expiry =
        typeof this.#options.expiry === 'function'
          ? this.#options.expiry(prunedPreviousExpiry as Expiry | null) // Update expiry on write
          : this.#options.expiry;
      this.#previousExpiry = expiry;

      localStorage.setItem(this.#key, stringify({ value, expiry }));
    } else {
      localStorage.setItem(this.#key, stringify(value));
    }
  }

  get current() {
    return this.#current;
  }

  set current(value: Value) {
    this.#current = value;
    this.#write(value);
  }

  /** Restore the initial value, and persist it */
  reset = () => {
    this.current = this.#initial;
  };

  /** Remove the stored value without changing `current` */
  clear = () => {
    if (browser) {
      localStorage.removeItem(this.#key);
    }
    this.#previousExpiry = null;
  };
}
