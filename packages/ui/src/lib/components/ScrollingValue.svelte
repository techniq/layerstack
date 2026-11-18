<script lang="ts" module>
  import type { Snippet } from 'svelte';

  export type ScrollingValueProps = {
    value?: number;
    /** Wrap from 9 back to 0, for a single digit */
    single?: boolean;
    format?: (value: number) => string | number;
    axis?: 'x' | 'y';
    class?: string;
    classes?: {
      root?: string;
      value?: string;
    };
    children?: Snippet<[{ value: number }]>;
  };
</script>

<script lang="ts">
  import { Spring } from 'svelte/motion';
  import { cls } from '@layerstack/tailwind';
  import { modulo } from '@layerstack/utils/number';

  import { getComponentClasses } from './theme.js';

  let {
    value = 0,
    single = false,
    format = (value) => value,
    axis = 'y',
    class: className,
    classes = {},
    children,
  }: ScrollingValueProps = $props();

  const settingsClasses = getComponentClasses('ScrollingValue');

  // svelte-ignore state_referenced_locally
  const spring = new Spring(value);

  $effect(() => {
    spring.target = value;
  });

  const offset = $derived(modulo(spring.current, 1));
  const nextDisplayValue = $derived(
    Math.floor(single && spring.current >= 9 ? 0 : spring.current + 1)
  );
  const currentDisplayValue = $derived(Math.floor(spring.current));
</script>

<div
  class={cls(
    'ScrollingValue',
    'inline-grid overflow-hidden',
    settingsClasses.root,
    classes.root,
    className
  )}
>
  <div
    class={cls('col-span-full row-span-full', settingsClasses.value, classes.value)}
    style:transform={axis === 'x'
      ? `translateX(${100 + 100 * -offset}%)`
      : `translateY(${-100 + 100 * offset}%)`}
  >
    {#if children}
      {@render children({ value: nextDisplayValue })}
    {:else}
      {format(nextDisplayValue)}
    {/if}
  </div>
  <div
    class={cls('col-span-full row-span-full', settingsClasses.value, classes.value)}
    style:transform={axis === 'x'
      ? `translateX(${100 * -offset}%)`
      : `translateY(${100 * offset}%)`}
  >
    {#if children}
      {@render children({ value: currentDisplayValue })}
    {:else}
      {format(currentDisplayValue)}
    {/if}
  </div>
</div>
