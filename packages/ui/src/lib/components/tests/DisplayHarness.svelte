<script lang="ts">
  import Badge from '../Badge.svelte';
  import InfiniteScroll from '../InfiniteScroll.svelte';
  import Lazy from '../Lazy.svelte';
  import Overflow from '../Overflow.svelte';
  import Paginate from '../Paginate.svelte';

  let { kind, ...props }: { kind: string } & Record<string, any> = $props();
</script>

{#if kind === 'badge-value'}
  <Badge {...props}>
    {#snippet valueSnippet()}
      <span data-testid="badge-value">!</span>
    {/snippet}
    <div data-testid="badge-anchor" class="size-10 bg-surface-200"></div>
  </Badge>
{:else if kind === 'badge'}
  <Badge {...props}>
    <div data-testid="badge-anchor" class="size-10 bg-surface-200"></div>
  </Badge>
{:else if kind === 'lazy'}
  <Lazy {...props as any}>
    <div data-testid="lazy-content">loaded</div>
  </Lazy>
{:else if kind === 'infinite'}
  <InfiniteScroll {...props as any}>
    {#snippet children({ visibleItems })}
      <output data-testid="visible-count">{visibleItems.length}</output>
      {#each visibleItems as item (item)}
        <div class="item">{item}</div>
      {/each}
    {/snippet}
  </InfiniteScroll>
{:else if kind === 'overflow'}
  <Overflow {...props as any} style="width: 100px; height: 40px; overflow: hidden">
    {#snippet children({ overflowX, overflowY })}
      <output data-testid="overflow-x">{overflowX}</output>
      <output data-testid="overflow-y">{overflowY}</output>
      <div style="width: 400px; height: 200px"></div>
    {/snippet}
  </Overflow>
{:else if kind === 'paginate'}
  <Paginate {...props as any}>
    {#snippet children({ pagination, pageData })}
      <output data-testid="page">{pagination.page}</output>
      <output data-testid="total-pages">{pagination.totalPages}</output>
      <output data-testid="page-data">{pageData.join(',')}</output>
      <button data-testid="next" onclick={pagination.nextPage}>next</button>
      <button data-testid="last" onclick={pagination.lastPage}>last</button>
    {/snippet}
  </Paginate>
{/if}
