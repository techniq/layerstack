/**
 * Wraps a `Promise` as reactive state.  Useful for SvelteKit streamed data handling.
 *
 * Only the most recent promise wins — an earlier one that resolves late is ignored, so results
 * cannot arrive out of order.
 */
export class PromiseState<T> {
  #loading = $state(false);
  #data: T | undefined = $state();
  #error: Error | undefined = $state();
  #aborted = $state(false);
  #currentPromise: Promise<T> | null = null;

  constructor(promise?: Promise<T> | null) {
    if (promise) {
      this.setPromise(promise);
    }
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

  /** Whether the last rejection was an `AbortError` */
  get aborted() {
    return this.#aborted;
  }

  setPromise = async (promise: Promise<T> | undefined | null) => {
    if (!promise) {
      this.#currentPromise = null;
      this.#data = undefined;
      this.#error = undefined;
      this.#loading = false;
      this.#aborted = false;
      return;
    }

    if (promise === this.#currentPromise) {
      return;
    }

    // Claim `current` synchronously — the store did this only after the race below, so two calls
    // made in the same tick could both proceed and the loser could overwrite the winner
    this.#currentPromise = promise;

    // If the promise has already settled, skip the loading state rather than flashing it.
    // Racing it against an immediate value (as the store did) makes an already-rejected promise
    // reject the race itself, which escaped as an unhandled rejection and left `error` unset.
    let alreadySettled = false;
    const markSettled = () => {
      alreadySettled = true;
    };
    promise.then(markSettled, markSettled);
    await Promise.resolve();

    if (this.#currentPromise !== promise) {
      return;
    }
    if (!alreadySettled) {
      this.#loading = true;
    }

    try {
      const data = await promise;
      if (this.#currentPromise === promise) {
        this.#data = data;
        this.#error = undefined;
        this.#loading = false;
        this.#aborted = false;
      }
    } catch (err) {
      if (this.#currentPromise === promise) {
        const error = err as Error;
        this.#data = undefined;
        this.#error = error;
        this.#aborted = error.name === 'AbortError';
        this.#loading = false;
      }
    }
  };
}
