<script lang="ts">
  import { Button, Paginate } from '@layerstack/ui';

  const data = Array.from({ length: 43 }, (_, i) => `Row ${i + 1}`);
</script>

<Paginate {data} perPage={10}>
  {#snippet children({ pagination, pageData })}
    <div class="border rounded-sm divide-y">
      {#each pageData as row (row)}
        <div class="px-3 py-1 text-sm">{row}</div>
      {/each}
    </div>

    <div class="flex items-center gap-2 mt-3">
      <Button variant="outline" disabled={!pagination.hasPrevious} onclick={pagination.prevPage}>
        Previous
      </Button>
      <Button variant="outline" disabled={!pagination.hasNext} onclick={pagination.nextPage}>
        Next
      </Button>
      <span class="text-sm text-surface-content/70">
        {pagination.from}–{pagination.to} of {pagination.total}
        (page {pagination.page} of {pagination.totalPages})
      </span>
    </div>
  {/snippet}
</Paginate>
