<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type ScrollContainerOwnProps = {
    class?: string;
    /** Receives a `scrollIntoView` helper bound to the container element */
    children?: Snippet<[{ scrollIntoView: (options?: ScrollIntoViewOptions) => void }]>;
  };

  export type ScrollContainerProps = ScrollContainerOwnProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof ScrollContainerOwnProps>;
</script>

<script lang="ts">
  let { class: className, children, ...restProps }: ScrollContainerProps = $props();

  let node: HTMLElement | undefined = $state();

  function scrollIntoView(options?: ScrollIntoViewOptions) {
    node?.scrollIntoView(options);
  }
</script>

<div bind:this={node} class={className} {...restProps}>
  {@render children?.({ scrollIntoView })}
</div>
