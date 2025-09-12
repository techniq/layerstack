import source from '$svelte-attachments/input.ts?raw';
import pageSource from './+page.svelte?raw';

export async function load() {
  return {
    meta: {
      source,
      pageSource,
      related: ['components/TextField', 'components/Input'],
    },
  };
}
