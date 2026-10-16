export type TimerOptions<T> = {
  initial?: T;

  /** Delay between ticks in milliseconds
   * @default 1000
   */
  delay?: number;

  /** Start disabled (manually call `start()`)
   * @default false
   */
  disabled?: boolean;

  /** Called on each interval tick.  Returned value is used to update store value, defaulting to current Date */
  tick?: (current: T | null) => any;
};

/**
 * Subscribable timer/interval state
 */
export class TimerState<T = any> {
  #initial: T | null;
  #current: T | null = $state(null);
  #intervalId: ReturnType<typeof setInterval> | null = null;
  #delay: number;
  #disabled: boolean;
  #running = $state(false);
  #tick: (current: T | null) => any;

  constructor(options: TimerOptions<T> = {}) {
    this.#initial = options.initial ?? null;
    this.#current = this.#initial;
    this.#delay = options.delay ?? 1000;
    this.#disabled = options.disabled ?? false;
    this.#tick = options.tick ?? (() => new Date());

    if (!this.#disabled) {
      this.start();
    }

    $effect(() => {
      return this.stop;
    });
  }

  get current() {
    return this.#current;
  }

  set current(value: T | null) {
    if (!this.#disabled) {
      this.start();
    }

    this.#current = value;
  }

  get delay() {
    return this.#delay;
  }

  set delay(value: number) {
    const isRunning = this.#running;
    this.stop();
    this.#delay = value;

    if (isRunning) {
      // Restart if was running
      this.start();
    }
  }

  start = () => {
    stop();
    this.#intervalId = setInterval(() => {
      this.#current = this.#tick(this.#current) ?? new Date();
    }, this.#delay);
    this.#running = true;
  };

  stop = () => {
    if (this.#intervalId) {
      clearInterval(this.#intervalId);
    }
    this.#intervalId = null;
    this.#running = false;
  };

  reset = () => {
    return (this.#current = this.#initial);
  };

  get running() {
    return this.#running;
  }
}
