import { untrack } from 'svelte';
import { Tween } from 'svelte/motion';
import { EasingFunction } from 'svelte/transition';
import { scaleLinear } from 'd3-scale';

// Define Attachment type locally until Svelte 5.29+ is available
export type Attachment<T extends EventTarget = Element> = (element: T) => void | (() => void);

export type DataBackgroundOptions = {
  value: number | null | undefined;
  domain?: [number, number];

  /**
   * Set color explicitly.  Can also use the following:
   *   - tailwind gradient classes (`from-blue-200 to-blue-400`)
   *   - Set CSS variables `--color-from` and `--color-to`
   */
  color?: string | ((value: number) => string);

  /**
   * Render as bar or fill (heatmap)
   */
  mode?: 'bar' | 'fill';

  /** Inset bar.  Pass as [x,y] to specify per axis */
  inset?: number | [number, number];

  enabled?: boolean;

  /**
   * Show baseline
   */
  baseline?: boolean;

  tween?: { duration?: number; easing?: EasingFunction; delay?: number };
};

export function dataBackground(getOptions: () => DataBackgroundOptions): Attachment<HTMLElement> {
  return (node: HTMLElement) => {
    // TODO: Should we track `tween`-only options to not require `{#key}`
    const tweenOptions = untrack(() => {
      // Set duration to 0 by default to be instantaneous
      return { duration: 0, ...getOptions().tween };
    });
    const baseline = new Tween(0, tweenOptions);
    const barStart = new Tween(0, tweenOptions);
    const barEnd = new Tween(0, tweenOptions);

    // Update CSS properties reactively using $effect
    $effect(() => {
      node.style.setProperty('--baseline', `${baseline.current}%`);
      node.style.setProperty('--barStart', `${barStart.current}%`);
      node.style.setProperty('--barEnd', `${barEnd.current}%`);
    });

    $effect(() => {
      const options = getOptions();
      const { domain, color, mode = 'bar', inset, enabled } = options;

      const value = options.value ?? 0;

      if (enabled === false) {
        // remove styles
        node.style.backgroundImage = '';
        node.style.backgroundRepeat = '';
        node.style.backgroundSize = '';
      } else {
        // Map values from 0% to 100%
        const scale = scaleLinear()
          .domain(domain ?? [-100, 100])
          .range([0, 100]);

        baseline.target = scale(0);
        barStart.target = scale(Math.min(0, value));
        barEnd.target = scale(Math.max(0, value));

        node.style.setProperty(
          '--color-from',
          (typeof color === 'function' ? color(value) : color) ?? 'var(--tw-gradient-from)'
        );
        node.style.setProperty(
          '--color-to',
          (typeof color === 'function' ? color(value) : color) ?? 'var(--tw-gradient-to)'
        );

        const insetX = Array.isArray(inset) ? inset[0] : inset;
        const insetY = Array.isArray(inset) ? inset[1] : inset;

        node.style.backgroundSize = `
			calc(100% - (${insetX}px * 2))
			calc(100% - (${insetY}px * 2))`;
        node.style.backgroundPosition = `${insetX}px ${insetY}px`;

        // Show black baseline at `0` first, then value bar
        // TODO: Handle baseline at `100%` (only negative numbers)
        node.style.backgroundImage =
          mode === 'bar'
            ? `${
                options.baseline
                  ? `
            linear-gradient(
              to right,
              transparent var(--baseline),
              currentColor var(--baseline),
              currentColor calc(var(--baseline) + 1px),
              transparent 0%,
              transparent 100%
            ),
          `
                  : ''
              }
            linear-gradient(
              to right,
              transparent var(--barStart),
              var(--color-from) var(--barStart),
              var(--color-to) var(--barEnd),
              transparent 0%,
              transparent 100%
            )
          `
            : `linear-gradient(
          to right,
          var(--color-from),
          var(--color-to)
        )`;

        // Add `no-repeat` to fix small gap on 100% and also support `background-origin` setting (inset)
        node.style.backgroundRepeat = 'no-repeat';
      }
    });

    // Return cleanup function
    return () => {
      // Clean up styles
      node.style.backgroundImage = '';
      node.style.backgroundRepeat = '';
      node.style.backgroundSize = '';
      node.style.backgroundPosition = '';
      node.style.removeProperty('--baseline');
      node.style.removeProperty('--barStart');
      node.style.removeProperty('--barEnd');
      node.style.removeProperty('--color-from');
      node.style.removeProperty('--color-to');
    };
  };
}
