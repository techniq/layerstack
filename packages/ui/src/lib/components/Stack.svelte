<script lang="ts" module>
  import type { Snippet } from 'svelte';

  import type { GridProps } from './Grid.svelte';

  type StackOwnProps = {
    vertical?: boolean;
    horizontal?: boolean;
    /** Place every child in the same cell, centered */
    stack?: boolean;
    /** Grid template for the stacking axis */
    template?: string;
    children?: Snippet;
  };

  export type StackProps = StackOwnProps & Omit<GridProps, keyof StackOwnProps>;
</script>

<script lang="ts">
  import Grid from './Grid.svelte';

  let { vertical, horizontal, stack, template, children, ...restProps }: StackProps = $props();
</script>

{#if vertical}
  <Grid autoFlow="row" templateColumns="initial" templateRows={template} {...restProps}>
    {@render children?.()}
  </Grid>
{:else if horizontal}
  <Grid autoFlow="column" templateColumns={template} templateRows="initial" {...restProps}>
    {@render children?.()}
  </Grid>
{:else if stack}
  <Grid
    stack
    items="center"
    justifyItems="center"
    templateColumns="initial"
    templateRows="initial"
    {...restProps}
  >
    {@render children?.()}
  </Grid>
{/if}
