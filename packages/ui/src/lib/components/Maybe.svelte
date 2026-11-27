<script lang="ts" module>
  import type { Component, Snippet } from 'svelte';

  export type MaybeProps = {
    /** Wrap `children` in this component when set; render them bare otherwise */
    this?: Component<any, any, any> | null;
    children?: Snippet;
  } & Record<string, any>;
</script>

<script lang="ts">
  let { this: self, children, ...restProps }: MaybeProps = $props();
</script>

{#if self}
  {@const Wrapper = self}
  <Wrapper {...restProps}>
    {@render children?.()}
  </Wrapper>
{:else}
  {@render children?.()}
{/if}
