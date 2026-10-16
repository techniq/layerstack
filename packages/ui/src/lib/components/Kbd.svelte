<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type KbdOwnProps = {
    control?: boolean;
    option?: boolean;
    shift?: boolean;
    command?: boolean;
    variant?: 'filled' | 'none';
    class?: string;
    children?: Snippet;
  };

  export type KbdProps = KbdOwnProps & Omit<HTMLAttributes<HTMLElement>, keyof KbdOwnProps>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  let {
    control = false,
    option = false,
    shift = false,
    command = false,
    variant = 'filled',
    class: className,
    children,
    ...restProps
  }: KbdProps = $props();
</script>

<kbd
  {...restProps}
  class={cls(
    'Kbd',
    'font-sans inline-flex gap-1',
    variant === 'filled' &&
      'border border-b-2 text-surface-content bg-surface-200 rounded-sm py-1 px-1',
    className
  )}
>
  {#if control}
    <abbr title="Control" class="no-underline">⌃</abbr>
  {/if}

  {#if option}
    <abbr title="Option" class="no-underline">⌥</abbr>
  {/if}

  {#if shift}
    <abbr title="Shift" class="no-underline">⇧</abbr>
  {/if}

  {#if command}
    <abbr title="Command" class="no-underline">⌘</abbr>
  {/if}

  {@render children?.()}
</kbd>
