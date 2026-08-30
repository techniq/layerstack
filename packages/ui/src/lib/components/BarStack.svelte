<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export type BarStackItem = {
    label: string;
    value: number;
    color?: string;
    style?: string;
    classes?: {
      root?: string;
      bar?: string;
    };
  };

  type BarStackOwnProps = {
    data: BarStackItem[];
    /** Denominator for each segment.  Defaults to the sum of `data` */
    total?: number;
    class?: string;
    classes?: {
      root?: string;
      item?: string;
    };
    /** Called when a segment is clicked */
    onItemClick?: (item: BarStackItem) => void;
    /** Replaces a whole segment */
    children?: Snippet<[{ item: BarStackItem; total: number }]>;
    /** Replaces just the colored bar within a segment */
    bar?: Snippet<[{ item: BarStackItem; total: number }]>;
  };

  export type BarStackProps = BarStackOwnProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof BarStackOwnProps>;
</script>

<script lang="ts">
  import { sum } from 'd3-array';
  import { cls } from '@layerstack/tailwind';

  import { getComponentClasses } from './theme.js';

  let {
    data,
    total,
    class: className,
    classes = {},
    onItemClick,
    children,
    bar,
    ...restProps
  }: BarStackProps = $props();

  const settingsClasses = getComponentClasses('BarStack');

  const resolvedTotal = $derived(total ?? sum(data, (d) => d.value) ?? 0);
</script>

<div
  {...restProps}
  class={cls('BarStack', 'flex gap-px', settingsClasses.root, classes.root, className)}
>
  {#each data as item (item.label)}
    <!-- Hide empty segments -->
    {#if item.value}
      <button
        style:flex={item.value}
        class={cls(
          'item',
          'group relative overflow-hidden transition-[flex] duration-300 ease-in-out text-left',
          classes.item,
          item.classes?.root
        )}
        onclick={() => onItemClick?.(item)}
      >
        {#if children}
          {@render children({ item, total: resolvedTotal })}
        {:else}
          <div
            class={cls('group-first:rounded-l group-last:rounded-r', item.classes?.bar)}
            style:background-color={item.color}
            style={item.style}
          >
            {#if bar}
              {@render bar({ item, total: resolvedTotal })}
            {:else}
              <div class="h-1"></div>
            {/if}
          </div>
        {/if}
      </button>
    {/if}
  {/each}
</div>
