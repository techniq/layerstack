import source from '$svelte-actions/styles.ts?raw';
import pageSource from './+page.svelte?raw';

export async function load() {
  return {
    meta: {
      source,
      pageSource,
      description: 'Actions to conveniently work with CSS styles',
    },
  };
}
