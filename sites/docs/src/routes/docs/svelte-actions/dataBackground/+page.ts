import source from '$svelte-actions/dataBackground.ts?raw';
import pageSource from './+page.svelte?raw';

export async function load() {
  return {
    meta: {
      source,
      pageSource,
      description:
        'Set background gradient based on data, similar to Excel.  Typically used within a table',
      related: ['components/Table', 'svelte-table/actions/table'],
    },
  };
}
