<script lang="ts">
  import ErrorNotification from '../ErrorNotification.svelte';
  import Notification from '../Notification.svelte';
  import Pagination from '../Pagination.svelte';
  import { PaginationState } from '@layerstack/svelte-state';

  let {
    kind,
    open = $bindable(true),
    total = 43,
    perPage = 10,
    ...props
  }: Record<string, any> = $props();

  // svelte-ignore state_referenced_locally
  const pagination = new PaginationState({ perPage, total });
</script>

{#if kind === 'pagination'}
  <Pagination {pagination} {...props as any}>
    {#snippet actions()}
      <button data-testid="pagination-action">Act</button>
    {/snippet}
  </Pagination>
  <output data-testid="page">{pagination.page}</output>
  <output data-testid="per-page">{pagination.perPage}</output>
{:else if kind === 'notification'}
  <Notification bind:open {...props as any} />
{:else if kind === 'error'}
  <ErrorNotification {...props as any} />
{/if}
