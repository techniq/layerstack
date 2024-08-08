import source from '$utils/duration.ts?raw';
import pageSource from './+page.svelte?raw';

export async function load() {
  return {
    meta: {
      source,
      pageSource,
      related: ['components/Duration'],
    },
  };
}
