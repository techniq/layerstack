<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type LazyOwnProps = {
    /** Placeholder height.  Match the rendered height closely to reduce scroll bouncing */
    height: string | number;
    /** Unmount once no longer visible, capturing the rendered height first */
    unmount?: boolean;
    /** Expand the intersection area, so content mounts before it scrolls into view */
    offset?: { top?: string; bottom?: string; left?: string; right?: string };
    class?: string;
    onIntersecting?: (entry: IntersectionObserverEntry) => void;
    children?: Snippet;
  };

  export type LazyProps = LazyOwnProps & Omit<HTMLAttributes<HTMLDivElement>, keyof LazyOwnProps>;
</script>

<script lang="ts">
  import { intersection } from '@layerstack/svelte-attachments';
  import { cls } from '@layerstack/tailwind';

  import { getComponentClasses } from './theme.js';

  let {
    height = $bindable(),
    unmount = false,
    offset = {},
    class: className,
    onIntersecting,
    children,
    ...restProps
  }: LazyProps = $props();

  const settingsClasses = getComponentClasses('Lazy');

  let show = $state(false);
</script>

<div
  {...restProps}
  style:min-height={typeof height === 'number' ? `${height}px` : height}
  class={cls('Lazy', settingsClasses.root, className)}
  {@attach intersection({
    rootMargin: `${offset.top ?? '0px'} ${offset.right ?? '0px'} ${offset.bottom ?? '0px'} ${offset.left ?? '0px'}`,
    onIntersecting: (entry) => {
      if (entry.isIntersecting) {
        show = true;
      } else if (unmount) {
        height = entry.boundingClientRect.height;
        show = false;
      }
      onIntersecting?.(entry);
    },
  })}
>
  {#if show}
    {@render children?.()}
  {/if}
</div>
