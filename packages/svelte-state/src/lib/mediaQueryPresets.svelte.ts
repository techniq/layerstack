import { MediaQuery } from 'svelte/reactivity';

// Matches tailwind defaults (https://tailwindcss.com/docs/responsive-design)
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

export class MediaQueryPresets {
  width(width: number) {
    return new MediaQuery(`(min-width: ${width}px)`);
  }

  height(height: number) {
    return new MediaQuery(`(min-height: ${height}px)`);
  }

  smScreen = this.width(breakpoints.sm);
  mdScreen = this.width(breakpoints.md);
  lgScreen = this.width(breakpoints.lg);
  xlScreen = this.width(breakpoints.xl);
  xxlScreen = this.width(breakpoints.xxl);

  screen = new MediaQuery('screen and (min-width: 0)'); // workaround for https://github.com/sveltejs/svelte/issues/15930
  print = new MediaQuery('print and (min-width: 0)'); // workaround for https://github.com/sveltejs/svelte/issues/15930

  dark = new MediaQuery('(prefers-color-scheme: dark)');
  light = new MediaQuery('(prefers-color-scheme: light)');

  motion = new MediaQuery('(prefers-reduced-motion: no-preference)');
  motionReduce = new MediaQuery('(prefers-reduced-motion: reduce)');

  landscape = new MediaQuery('(orientation: landscape)');
  portrait = new MediaQuery('(orientation: portrait)');
}
