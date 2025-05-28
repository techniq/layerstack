import source from '$svelte-state/mediaQueryPresets.svelte.ts?raw';
import pageSource from './+page.svelte?raw';

export async function load() {
  return {
    meta: {
      source,
      pageSource,
      description:
        'Presets to monitor media query matching, including screen width/height, orientation, print media, prefers dark/light scheme, and prefers reduced motion',
    },
  };
}
