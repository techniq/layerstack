<script lang="ts" module>
  import type { FormatNumberStyle } from '@layerstack/utils';

  import type { FieldProps } from './Field.svelte';

  type RangeFieldOwnProps = {
    /** Bindable */
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    /** Format preset applied to the displayed value */
    format?: FormatNumberStyle;
    /** Called when the value changes */
    onChange?: (detail: { value: number }) => void;
  };

  export type RangeFieldProps = RangeFieldOwnProps &
    Omit<FieldProps, keyof RangeFieldOwnProps | 'children'>;
</script>

<script lang="ts">
  import Button from './Button.svelte';
  import Field from './Field.svelte';
  import { getComponentSettings, getSettings } from './settingsState.svelte.js';

  const { defaults } = getComponentSettings('RangeField');
  const settings = getSettings();

  let {
    value = $bindable(0),
    min = 0,
    max = 100,
    step = 1,
    format = 'none',
    onChange,
    ...restProps
  }: RangeFieldProps = $props();

  const icons = $derived(settings.icons);

  let lastValue = value;
  $effect(() => {
    if (value === lastValue) return;
    lastValue = value;
    onChange?.({ value });
  });
</script>

<Field classes={{ input: 'my-1' }} {...defaults} {...restProps}>
  {#snippet prepend()}
    <Button
      icon={icons.chevronLeft}
      onclick={() => (value -= value > min ? step : 0)}
      class="mr-2"
      size="sm"
    />
  {/snippet}

  {#snippet children({ id })}
    <input type="range" bind:value {min} {max} {step} {id} class="h-6 w-full" />

    <!-- Stacked so the width accounts for the widest of min/value/max -->
    <span class="ml-2 text-sm text-surface-content/50 tabular-nums text-right inline-grid">
      <span class="col-span-full row-span-full invisible">{settings.format(min, format)}</span>
      <span class="col-span-full row-span-full">{settings.format(value, format)}</span>
      <span class="col-span-full row-span-full invisible">{settings.format(max, format)}</span>
    </span>
  {/snippet}

  {#snippet append()}
    <Button
      icon={icons.chevronRight}
      onclick={() => (value += value < max ? step : 0)}
      class="ml-2"
      size="sm"
    />
  {/snippet}
</Field>
