import { isEqual, set } from '@layerstack/utils';

export type FormIssue = { path: PropertyKey[]; message: string };

/**
 * Anything with a zod-compatible `safeParse`.  Typed structurally so this package does not depend
 * on zod (or any particular validation library).
 */
export type FormSchema<T> = {
  safeParse(
    value: unknown
  ): { success: true; data: T } | { success: false; error: { issues: readonly FormIssue[] } };
};

export type FormOptions<T> = {
  /** Validated on `commit()`.  Failures populate `errors` and abort the commit */
  schema?: FormSchema<T>;

  /** Number of commits kept for `undo()`
   * @default 100
   */
  historyLimit?: number;
};

/** Deep clone by round-tripping through a `$state` proxy, so nothing is shared with the source */
function clone<T>(value: T): T {
  const proxy = $state(value);
  return $state.snapshot(proxy) as T;
}

/**
 * Editable form state with a working draft, schema validation, and undo.
 *
 * `draft` is a deeply reactive copy that inputs bind to directly.  `commit()` validates it and
 * promotes it to `state`; `revert()` throws it away.  Nothing outside the form sees a change until
 * a commit succeeds.
 */
export class FormState<T extends object = any> {
  #initial: T;
  #schema: FormSchema<T> | undefined;
  #historyLimit: number;

  /** Committed snapshots, oldest first.  Popped by `undo()` */
  #history: T[] = $state([]);

  #committed: T = $state({} as T);
  #errors: Record<string, any> = $state({});

  /** Deeply reactive working copy.  Bind form inputs straight to this */
  draft: T = $state({} as T);

  constructor(initial: T, options: FormOptions<T> = {}) {
    this.#schema = options.schema;
    this.#historyLimit = options.historyLimit ?? 100;

    // Separate clones throughout, so editing the draft never writes through to the caller's object
    this.#initial = clone(initial);
    this.#committed = clone(initial);
    this.draft = clone(initial);
  }

  /** Last committed value */
  get state(): T {
    return this.#committed;
  }

  /** Validation messages from the last failed `commit()`, nested to mirror the schema paths */
  get errors(): Record<string, any> {
    return this.#errors;
  }

  /** Whether the draft differs from the last committed value */
  get isDirty(): boolean {
    return !isEqual($state.snapshot(this.draft), this.#committed);
  }

  /** Whether there is a committed change to `undo()` */
  get canUndo(): boolean {
    return this.#history.length > 0;
  }

  /**
   * Validate the draft and, if it passes, promote it to `state`.
   *
   * @returns `true` when committed, `false` when validation failed
   */
  commit(): boolean {
    const next = $state.snapshot(this.draft) as T;

    if (this.#schema) {
      const result = this.#schema.safeParse(next);
      if (!result.success) {
        const errors = {};
        for (const issue of result.error.issues) {
          set(errors, issue.path as (string | number | symbol)[], issue.message);
        }
        this.#errors = errors;
        return false;
      }
      this.#errors = {};
    }

    this.#history.push(this.#committed);
    if (this.#history.length > this.#historyLimit) {
      this.#history.shift();
    }

    this.#committed = next;
    // Re-clone so the draft and the committed value never share nested objects
    this.draft = clone(next);

    return true;
  }

  /** Discard the draft, restoring the last committed value */
  revert() {
    this.#errors = {};
    this.draft = clone(this.#committed);
  }

  /** Discard the draft *and* every commit, restoring the initial value */
  revertAll() {
    this.#errors = {};
    this.#history = [];
    this.#committed = clone(this.#initial);
    this.draft = clone(this.#initial);
  }

  /** Restore the value from before the last commit */
  undo() {
    const previous = this.#history.pop();
    if (previous === undefined) return;

    this.#errors = {};
    this.#committed = previous;
    this.draft = clone(previous);
  }
}
