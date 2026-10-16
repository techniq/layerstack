<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  export type TabPlacement = 'top' | 'bottom' | 'left' | 'right';

  type TabOwnProps = {
    selected?: boolean;
    placement?: TabPlacement;
    class?: string;
    classes?: { root?: string };
    children?: Snippet;
  };

  export type TabProps = TabOwnProps & Omit<HTMLButtonAttributes, keyof TabOwnProps>;
</script>

<script lang="ts">
  import { slide } from 'svelte/transition';
  import { cls } from '@layerstack/tailwind';

  import { getComponentClasses } from './theme.js';

  let {
    selected = false,
    placement = 'top',
    class: className,
    classes = {},
    children,
    ...restProps
  }: TabProps = $props();

  const settingsClasses = getComponentClasses('Tab');

  const vertical = $derived(placement === 'left' || placement === 'right');
</script>

<button
  type="button"
  {...restProps}
  class={cls(
    'Tab',
    'inline-flex items-center gap-1 whitespace-nowrap border px-3 py-2 text-xs',
    `placement-${placement}`,
    {
      top: selected && 'border-b-surface-100',
      bottom: selected && 'border-t-surface-100',
      left: selected && 'border-r-surface-100',
      right: selected && 'border-l-surface-100',
    }[placement],
    selected
      ? 'bg-surface-100 text-surface-content'
      : 'bg-surface-200 text-surface-content/50 hover:text-surface-content hover:bg-surface-100',
    settingsClasses.root,
    classes.root,
    className
  )}
  transition:slide={{ axis: vertical ? 'y' : 'x' }}
>
  {@render children?.()}
</button>
