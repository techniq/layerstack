import { SvelteSet } from 'svelte/reactivity';

/**
 * State to manage unique values using `SvelteSet` with improved
 * ergonomics and better control of updates
 */
export class UniqueState<T = string | number> {
  current: SvelteSet<T>;

  constructor(initialValues?: T[]) {
    this.current = new SvelteSet<T>(initialValues ?? []);
  }

  reset() {
    this.current.clear();
  }

  add(value: T) {
    this.current.add(value);
  }

  addEach(values: T[]) {
    for (const value of values) {
      this.current.add(value);
    }
  }

  delete(value: T) {
    this.current.delete(value);
  }

  toggle(value: T) {
    if (this.current.has(value)) {
      this.current.delete(value);
    } else {
      this.current.add(value);
    }
  }
}
