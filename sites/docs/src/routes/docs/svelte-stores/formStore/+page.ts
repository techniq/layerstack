import source from '$svelte-stores/formStore.ts?raw';
import pageSource from './+page.md?raw';

export async function load() {
  return {
    meta: {
      source,
      pageSource,
      description: 'Manage form state via immer draft and zod scehma, with undo history',
      related: ['components/Form'],
    },
  };
}
