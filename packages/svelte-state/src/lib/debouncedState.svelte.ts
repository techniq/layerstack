import { untrack } from 'svelte';

/**
 * Track another value, but only adopt it once it has stopped changing for `delay` milliseconds.
 *
 * Reads its source through a getter so the dependency is tracked:
 *
 * ```ts
 * let search = $state('');
 * const debounced = new DebouncedState(() => search, 300);
 * ```
 *
 * Must be created where effects can run (component initialization or `$effect.root`).
 */
export class DebouncedState<T> {
  #current: T = $state()!;
  #pending = $state(false);

  constructor(getValue: () => T, delay = 300) {
    // Start at the current value rather than empty, so the first render is not a blank frame
    this.#current = untrack(getValue);

    $effect(() => {
      const value = getValue();

      if (value === untrack(() => this.#current)) {
        // Changed and changed back within the delay — nothing left to settle on
        this.#pending = false;
        return;
      }

      this.#pending = true;
      const timeoutId = setTimeout(() => {
        this.#current = value;
        this.#pending = false;
      }, delay);

      return () => clearTimeout(timeoutId);
    });
  }

  get current() {
    return this.#current;
  }

  /** Whether the source has changed and the delay has not yet elapsed */
  get pending() {
    return this.#pending;
  }
}
