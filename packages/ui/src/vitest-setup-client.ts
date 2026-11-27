/// <reference types="vitest/browser" />
/// <reference types="@vitest/browser-playwright" />

import { vi } from 'vitest';

/**
 * `vi.waitFor` defaults to a 1s timeout, and unlike `expect.poll` it has no global setting.
 *
 * These are real browser renders, and under CPU contention (a parallel docs build, or a small CI
 * runner) a component can take longer than a second to settle — which then reports a perfectly
 * healthy render as a failure.  Raising the default only changes how long a genuine failure takes
 * to surface; individual calls can still pass their own timeout.
 */
const waitFor = vi.waitFor;
vi.waitFor = ((callback: Parameters<typeof waitFor>[0], options?: Parameters<typeof waitFor>[1]) =>
  waitFor(
    callback,
    typeof options === 'number' ? options : { timeout: 5000, ...options }
  )) as typeof vi.waitFor;
