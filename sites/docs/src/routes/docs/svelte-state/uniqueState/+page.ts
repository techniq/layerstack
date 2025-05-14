import source from '$svelte-state/uniqueState.svelte.ts?raw';
import pageSource from './+page.svelte?raw';

export async function load() {
  return {
    meta: {
      source,
      pageSource,
      description:
        'State to manage unique values using `Set` with improves ergonomics and better control of updates',
      related: ['svelte-state/SelectionState'],
    },
  };
}
