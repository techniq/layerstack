import source from '$svelte-stores/graphStore.ts?raw';
import pageSource from './+page.md?raw';

export async function load() {
  return {
    meta: {
      source,
      pageSource,
      description: ['GraphQL requests powered by fetchStore'],
      related: ['stores/fetchStore'],
    },
  };
}
