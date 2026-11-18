<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { FormatNumberStyle } from '@layerstack/utils';

  export type TweenedValueProps = {
    value: number | null;
    /** Format preset applied to the default rendering */
    format?: FormatNumberStyle;
    options?: {
      delay?: number;
      duration?: number | ((from: number, to: number) => number);
      easing?: (t: number) => number;
      interpolate?: (a: number, b: number) => (t: number) => number;
    };
    /** Render the value immediately, without animating */
    disabled?: boolean;
    children?: Snippet<[{ value: number | null }]>;
  };
</script>

<script lang="ts">
  import { Tween } from 'svelte/motion';

  import { getSettings } from './settingsState.svelte.js';

  let { value, format = 'none', options, disabled = false, children }: TweenedValueProps = $props();

  const settings = getSettings();

  // svelte-ignore state_referenced_locally
  const tween = new Tween(value ?? 0, options);

  $effect(() => {
    tween.target = value ?? 0;
  });

  const displayValue = $derived(disabled || value == null ? value : tween.current);
</script>

{#if children}
  {@render children({ value: displayValue })}
{:else}
  {settings.format(displayValue, format)}
{/if}
