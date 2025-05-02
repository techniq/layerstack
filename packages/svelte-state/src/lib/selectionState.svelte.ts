import { UniqueState } from './uniqueState.svelte.js';

export type SelectionProps<T> = {
  /** Initial values */
  initial?: T[];

  /** All values to select when `toggleAll()` is called */
  all?: T[];

  /** Only allow 1 selected value */
  single?: boolean;

  /** Maximum number of values that can be selected  */
  max?: number;
};

// export type SelectionState<T> = ReturnType<typeof selectionState<T>>;

export class SelectionState<T> {
  #initial: T[];
  #selected: UniqueState<T>;

  all: Array<T>;
  single: boolean;
  max: number | undefined;

  constructor(props: SelectionProps<T> = {}) {
    this.#initial = props.initial ?? [];
    this.#selected = new UniqueState(this.#initial);

    this.all = props.all ?? [];
    this.single = props.single ?? false;
    this.max = props.max;
  }

  get current() {
    return this.single
      ? (Array.from(this.#selected.current)[0] ?? null)
      : Array.from(this.#selected.current);
  }

  isSelected(value: T) {
    return this.#selected.current.has(value);
  }

  isEmpty() {
    return this.#selected.current.size === 0;
  }

  isAllSelected() {
    return this.all.every((v) => this.#selected.current.has(v));
  }

  isAnySelected() {
    return this.all.some((v) => this.#selected.current.has(v));
  }

  isMaxSelected() {
    return this.max != null ? this.#selected.current.size >= this.max : false;
  }

  isDisabled(value: T) {
    return !this.isSelected(value) && this.isMaxSelected();
  }

  clear() {
    this.#selected.reset();
  }

  reset() {
    this.#selected.reset();
    this.#selected.addEach(this.#initial ?? []);
  }

  setSelected(values: T[]) {
    if (this.max == null || values.length < this.max) {
      this.#selected.reset();
      this.#selected.addEach(values);
    }
  }

  toggleSelected(value: T) {
    if (this.#selected.current.has(value)) {
      // Remove
      const prevSelected = [...this.#selected.current];
      this.#selected.reset();
      this.#selected.addEach(prevSelected.filter((v) => v != value));
    } else if (this.single) {
      // Replace
      this.#selected.reset();
      this.#selected.add(value);
    } else {
      // Add
      if (this.max == null || this.#selected.current.size < this.max) {
        return this.#selected.add(value);
      }
    }
  }

  toggleAll() {
    let values: T[];
    if (this.isAllSelected()) {
      // Deselect all (within current `all`, for example page/filtered result)
      values = [...this.#selected.current].filter((v) => !this.all.includes(v));
    } else {
      // Select all (`new Set()` will dedupe)
      values = [...this.#selected.current, ...this.all];
    }
    this.#selected.reset();
    this.#selected.addEach(values);
  }
}
