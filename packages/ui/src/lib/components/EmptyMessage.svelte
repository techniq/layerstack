<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export type EmptyMessageProps = {
    class?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLDivElement>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  import { getComponentClasses } from './theme.js';

  let { class: className, children, ...restProps }: EmptyMessageProps = $props();

  const settingsClasses = getComponentClasses('EmptyMessage');
</script>

<div
  {...restProps}
  class={cls(
    'EmptyMessage',
    'grid place-items-center',
    'p-1 bg-surface-300 ring-surface-200/30',
    'text-surface-content/50 text-xs tracking-wider',
    'border border-surface-100/80 rounded-sm',
    settingsClasses.root,
    className
  )}
>
  {@render children?.()}
</div>
