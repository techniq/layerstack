import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { TimerState } from './timerState.svelte.js';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('TimerState', () => {
  it('ticks on the given delay', () => {
    const timer = new TimerState({ delay: 100, initial: 0, tick: (current) => (current ?? 0) + 1 });

    expect(timer.current).toBe(0);

    vi.advanceTimersByTime(250);
    expect(timer.current).toBe(2);

    timer.stop();
  });

  it('starts disabled when asked', () => {
    const timer = new TimerState({
      delay: 100,
      initial: 0,
      disabled: true,
      tick: (c) => (c ?? 0) + 1,
    });

    expect(timer.running).toBe(false);
    vi.advanceTimersByTime(500);
    expect(timer.current).toBe(0);

    timer.start();
    expect(timer.running).toBe(true);
    vi.advanceTimersByTime(100);
    expect(timer.current).toBe(1);

    timer.stop();
  });

  it('does not leak an interval when restarted', () => {
    const timer = new TimerState({ delay: 100, initial: 0, tick: (c) => (c ?? 0) + 1 });

    // `start()` must clear the running interval first — calling the global `stop()` instead would
    // leave both intervals ticking, doubling the rate
    timer.start();
    timer.start();

    vi.advanceTimersByTime(100);
    expect(timer.current).toBe(1);

    timer.stop();
  });

  it('does not call the global `stop()`', () => {
    const globalStop = vi.fn();
    vi.stubGlobal('stop', globalStop);

    const timer = new TimerState({ delay: 100 });
    timer.start();

    expect(globalStop).not.toHaveBeenCalled();
    timer.stop();
  });

  it('restarts on a new delay only when running', () => {
    const timer = new TimerState({ delay: 100, initial: 0, tick: (c) => (c ?? 0) + 1 });

    timer.delay = 50;
    expect(timer.running).toBe(true);
    vi.advanceTimersByTime(50);
    expect(timer.current).toBe(1);

    timer.stop();
    timer.delay = 25;
    expect(timer.running).toBe(false);
    vi.advanceTimersByTime(100);
    expect(timer.current).toBe(1);
  });

  it('resets to the initial value', () => {
    const timer = new TimerState({ delay: 100, initial: 5, tick: (c) => (c ?? 0) + 1 });

    vi.advanceTimersByTime(100);
    expect(timer.current).toBe(6);

    timer.reset();
    expect(timer.current).toBe(5);

    timer.stop();
  });

  it('defaults each tick to the current date', () => {
    const timer = new TimerState({ delay: 100 });

    vi.advanceTimersByTime(100);
    expect(timer.current).toBeInstanceOf(Date);

    timer.stop();
  });
});
