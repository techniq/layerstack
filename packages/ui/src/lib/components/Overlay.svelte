<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { TransitionConfig } from 'svelte/transition';

  type OverlayOwnProps = {
    center?: boolean;
    /** `[transitionFn, params]` used to fade the overlay in and out */
    transition?: [(node: Element, options: any) => TransitionConfig, object];
    class?: string;
    children?: Snippet;
  };

  export type OverlayProps = OverlayOwnProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof OverlayOwnProps>;
</script>

<script lang="ts">
  import { fade } from 'svelte/transition';
  import { cls } from '@layerstack/tailwind';

  import { getComponentClasses } from './theme.js';

  let {
    center = false,
    transition = [fade, { duration: 100 }],
    class: className,
    children,
    ...restProps
  }: OverlayProps = $props();

  const settingsClasses = getComponentClasses('Overlay');

  const transitionFn = $derived(transition[0]);
  const transitionConfig = $derived(transition[1]);
</script>

<div
  {...restProps}
  class={cls(
    'Overlay',
    'absolute top-0 bottom-0 left-0 right-0 z-30 bg-surface-100/75',
    center && 'flex items-center justify-center',
    settingsClasses.root,
    className
  )}
  transition:transitionFn={transitionConfig}
>
  {@render children?.()}
</div>
