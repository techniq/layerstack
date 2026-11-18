<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type OverflowOwnProps = {
    class?: string;
    /** Receives how far the content overflows on each axis, in pixels */
    children?: Snippet<[{ overflowX: number; overflowY: number }]>;
  };

  export type OverflowProps = OverflowOwnProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof OverflowOwnProps>;
</script>

<script lang="ts">
  import { overflow } from '@layerstack/svelte-attachments';
  import { cls } from '@layerstack/tailwind';

  import { getComponentClasses } from './theme.js';

  let { class: className, children, ...restProps }: OverflowProps = $props();

  const settingsClasses = getComponentClasses('Overflow');

  let overflowX = $state(0);
  let overflowY = $state(0);
</script>

<div
  {...restProps}
  class={cls('Overflow', settingsClasses.root, className)}
  {@attach overflow({
    onOverflow: (detail) => {
      overflowX = detail.overflowX;
      overflowY = detail.overflowY;
    },
  })}
>
  {@render children?.({ overflowX, overflowY })}
</div>
