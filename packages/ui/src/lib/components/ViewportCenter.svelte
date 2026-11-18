<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export type ViewportCenterProps = { children?: Snippet } & HTMLAttributes<HTMLDivElement>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  let { children, class: className, ...restProps }: ViewportCenterProps = $props();
</script>

<div
  {...restProps}
  class={cls(
    'ViewportCenter',
    'fixed top-0 left-0 h-screen w-screen flex flex-col items-center justify-center',
    className
  )}
>
  {@render children?.()}
</div>
