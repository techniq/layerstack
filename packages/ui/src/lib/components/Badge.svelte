<script lang="ts" module>
  import type { Snippet } from 'svelte';

  export type BadgeProps = {
    /** Hidden when `0`.  Defaults to `1` when a `value` snippet is supplied */
    value?: number;
    small?: boolean;
    /** Nudge positioning for a circular anchor (ex. an Avatar) */
    circle?: boolean;
    /** Render a dot with no content */
    dot?: boolean;
    class?: string;
    placement?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    /** Replaces the numeric content */
    valueSnippet?: Snippet;
    /** The element the badge is anchored to */
    children?: Snippet;
  };
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  import { getComponentClasses } from './theme.js';

  let {
    value,
    small = false,
    circle = false,
    dot = false,
    class: className,
    placement = 'top-right',
    valueSnippet,
    children,
  }: BadgeProps = $props();

  const settingsClasses = getComponentClasses('Badge');

  const resolvedValue = $derived(value ?? (valueSnippet ? 1 : 0));
</script>

<div class="inline-grid grid-stack">
  {@render children?.()}
  <div
    class={cls(
      'Badge',
      'rounded-full flex items-center justify-center transform transition-transform',

      !valueSnippet && 'bg-primary text-primary-content',

      {
        'self-start': placement.startsWith('top'),
        'self-end': placement.startsWith('bottom'),
        'justify-self-start': placement.endsWith('left'),
        'justify-self-end': placement.endsWith('right'),
      },

      dot
        ? {
            'h-2 w-2': small,
            'h-3 w-3': !small,
          }
        : {
            'h-4 w-4 text-[0.6rem]': small,
            'h-5 w-5 text-xs': !small,
          },

      dot
        ? {
            'translate-y-[40%]': small && placement.startsWith('top'),
            'translate-y-[-40%]': small && placement.startsWith('bottom'),
            'translate-x-[40%]': small && placement.endsWith('left'),
            'translate-x-[-40%]': small && placement.endsWith('right'),
            'translate-y-[10%]': !small && placement.startsWith('top'),
            'translate-y-[-10%]': !small && placement.startsWith('bottom'),
            'translate-x-[10%]': !small && placement.endsWith('left'),
            'translate-x-[-10%]': !small && placement.endsWith('right'),
          }
        : circle
          ? {
              'translate-y-[-10%]': small && placement.startsWith('top'),
              'translate-y-[10%]': small && placement.startsWith('bottom'),
              'translate-x-[-10%]': small && placement.endsWith('left'),
              'translate-x-[10%]': small && placement.endsWith('right'),
              'translate-y-[-20%]': !small && placement.startsWith('top'),
              'translate-y-[20%]': !small && placement.startsWith('bottom'),
              'translate-x-[-20%]': !small && placement.endsWith('left'),
              'translate-x-[20%]': !small && placement.endsWith('right'),
            }
          : {
              '-translate-y-1/3': placement.startsWith('top'),
              'translate-y-1/3': placement.startsWith('bottom'),
              '-translate-x-1/3': placement.endsWith('left'),
              'translate-x-1/3': placement.endsWith('right'),
            },

      {
        'scale-0': resolvedValue === 0,
        'scale-100': resolvedValue !== 0,
      },
      settingsClasses.root,
      className
    )}
  >
    {#if valueSnippet}
      {@render valueSnippet()}
    {:else if !dot}
      {resolvedValue || ''}
    {/if}
  </div>
</div>
