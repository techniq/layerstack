<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import { PaginationState } from '@layerstack/svelte-state';

  export type PaginateProps<T> = {
    data: T[];
    perPage?: number;
    children?: Snippet<[{ pagination: PaginationState; pageData: T[] }]>;
  };
</script>

<script lang="ts" generics="T">
  let { data, perPage = 10, children }: PaginateProps<T> = $props();

  // svelte-ignore state_referenced_locally
  const pagination = new PaginationState({ perPage });

  $effect(() => {
    pagination.perPage = perPage;
  });

  $effect(() => {
    pagination.total = data.length;
  });

  const pageData = $derived(pagination.slice(data));
</script>

{@render children?.({ pagination, pageData })}
