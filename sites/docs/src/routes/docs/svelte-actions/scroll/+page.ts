import source from '$svelte-actions/scroll.ts?raw';
import pageSource from './+page.svelte?raw';

export async function load() {
  return {
    meta: {
      source,
      pageSource,
    },
  };
}
