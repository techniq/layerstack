<script lang="ts" module>
  import type { Snippet } from 'svelte';

  export type InfiniteScrollProps<T> = {
    items: T[];
    /** Number of additional items revealed each time the sentinel scrolls into view */
    perPage?: number;
    /** Render every item at once */
    disabled?: boolean;
    onIntersecting?: (entry: IntersectionObserverEntry) => void;
    children?: Snippet<[{ visibleItems: T[] }]>;
  };
</script>

<script lang="ts" generics="T">
  import { intersection } from '@layerstack/svelte-attachments';

  let {
    items,
    perPage = 10,
    disabled = false,
    onIntersecting,
    children,
  }: InfiniteScrollProps<T> = $props();

  let page = $state(1);

  const visibleItems = $derived(disabled ? items : items.slice(0, page * perPage));
</script>

{@render children?.({ visibleItems })}

{#if !disabled}
  <!-- 1px tall, since a zero-height sentinel is sometimes not detected -->
  <div
    class="sentinel h-px"
    {@attach intersection({
      onIntersecting: (entry) => {
        if (entry.isIntersecting) {
          page += 1;
        }
        onIntersecting?.(entry);
      },
    })}
  ></div>
{/if}
