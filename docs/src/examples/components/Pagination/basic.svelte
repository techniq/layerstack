<script lang="ts">
  import { Pagination } from '@layerstack/ui';
  import { PaginationState } from '@layerstack/svelte-state';

  const pagination = new PaginationState({ perPage: 10, total: 143 });
</script>

<div class="grid gap-4">
  <Pagination {pagination} />

  <Pagination
    {pagination}
    show={['firstPage', 'prevPage', 'pagination', 'nextPage', 'lastPage', 'perPage']}
  />
</div>
