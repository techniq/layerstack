import source from '$svelte-stores/queryParamsStore.ts?raw';
import pageSource from './+page.md?raw';

export async function load() {
  return {
    meta: {
      source,
      pageSource,
      title: 'Query params',
      description: 'Manage query params as a store, with multiple serialization strategies',
      hideUsage: true,
    },
  };
}
