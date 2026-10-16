<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { FormatNumberStyle } from '@layerstack/utils';

  export type SpringValueProps = {
    value: number | null;
    /** Format preset applied to the default rendering */
    format?: FormatNumberStyle;
    options?: { stiffness?: number; damping?: number; precision?: number };
    /** Render the value immediately, without animating */
    disabled?: boolean;
    children?: Snippet<[{ value: number | null }]>;
  };
</script>

<script lang="ts">
  import { Spring } from 'svelte/motion';

  import { getSettings } from './settingsState.svelte.js';

  let { value, format = 'none', options, disabled = false, children }: SpringValueProps = $props();

  const settings = getSettings();

  // svelte-ignore state_referenced_locally
  const spring = new Spring(value ?? 0, options);

  $effect(() => {
    spring.target = value ?? 0;
  });

  const displayValue = $derived(disabled || value == null ? value : spring.current);
</script>

{#if children}
  {@render children({ value: displayValue })}
{:else}
  {settings.format(displayValue, format)}
{/if}
