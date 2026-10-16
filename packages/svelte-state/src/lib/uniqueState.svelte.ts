import { SvelteSet } from 'svelte/reactivity';

/**
 * State to manage unique values using `SvelteSet` with improved
 * ergonomics and better control of updates
 */
export class UniqueState<T = string | number> {
  #initial: T[];
  current: SvelteSet<T>;

  constructor(initial?: T[]) {
    this.#initial = initial ?? [];
    this.current = new SvelteSet<T>(initial ?? []);
  }

  /** Clear all values */
  clear() {
    this.current.clear();
  }

  /** Reset to initial values */
  reset() {
    this.clear();
    this.addEach(this.#initial);
  }

  /** Add a value */
  add(value: T) {
    this.current.add(value);
  }

  /** Add multiple values */
  addEach(values: T[]) {
    for (const value of values) {
      this.current.add(value);
    }
  }

  /** Remove a value */
  delete(value: T) {
    this.current.delete(value);
  }

  /** Toggle a value */
  toggle(value: T) {
    if (this.current.has(value)) {
      this.current.delete(value);
    } else {
      this.current.add(value);
    }
  }
}
