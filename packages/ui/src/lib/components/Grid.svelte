<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type GridOwnProps = {
    columns?: number;
    gap?: number;
    columnGap?: number;
    rowGap?: number;
    autoFlow?: 'row' | 'column';
    autoColumns?: string | null;
    template?: string | null;
    templateColumns?: string | null;
    templateRows?: string | null;
    /** Place every child in the same cell, stacked on top of each other */
    stack?: boolean;
    inline?: boolean;
    items?: 'start' | 'end' | 'center' | 'baseline' | 'stretch' | 'initial';
    justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | 'initial';
    justifyItems?: 'start' | 'end' | 'center' | 'baseline' | 'stretch' | 'initial';
    content?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | 'initial';
    children?: Snippet;
  };

  export type GridProps = GridOwnProps & Omit<HTMLAttributes<HTMLDivElement>, keyof GridOwnProps>;
</script>

<script lang="ts">
  let {
    columns = 0,
    gap = 0,
    columnGap,
    rowGap,
    autoFlow = 'row',
    autoColumns = null,
    template = null,
    templateColumns = null,
    templateRows = null,
    stack = false,
    inline = false,
    items = 'initial',
    justify = 'initial',
    justifyItems = 'initial',
    content = 'initial',
    children,
    ...restProps
  }: GridProps = $props();

  const templateColumnsResolved = $derived(
    templateColumns ??
      template ??
      (autoColumns ? `repeat(auto-fill, minmax(${autoColumns}, 1fr))` : `repeat(${columns}, 1fr)`)
  );
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  {...restProps}
  class="Grid"
  class:grid={!inline}
  class:inline-grid={inline}
  class:stack
  style:--templateColumns={templateColumnsResolved}
  style:--templateRows={templateRows}
  style:--gap={gap}
  style:--columnGap={columnGap ?? gap}
  style:--rowGap={rowGap ?? gap}
  style:--autoFlow={autoFlow}
  style:--items={items}
  style:--justify={justify}
  style:--justifyItems={justifyItems}
  style:--content={content}
>
  {@render children?.()}
</div>

<style>
  div {
    grid-template-columns: var(--templateColumns);
    grid-template-rows: var(--templateRows);
    grid-gap: calc(1px * var(--gap));
    grid-column-gap: calc(1px * var(--columnGap));
    grid-row-gap: calc(1px * var(--rowGap));
    grid-auto-flow: var(--autoFlow);
    align-items: var(--items);
    justify-content: var(--justify);
    justify-items: var(--justifyItems);
    align-content: var(--content);
  }

  .stack > :global(*) {
    grid-area: 1 / 1;
  }
</style>
