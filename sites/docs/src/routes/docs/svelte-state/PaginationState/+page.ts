import source from '$svelte-state/paginationState.svelte.js?raw';
import pageSource from './+page.svelte?raw';

export async function load() {
  return {
    meta: {
      source,
      pageSource,
      description:
        'Manage pagination state including current page and page navigation (next/previous/first/last).  See related Paginate/Pagination components',
      related: ['components/Paginate', 'components/Pagination'],
    },
  };
}
