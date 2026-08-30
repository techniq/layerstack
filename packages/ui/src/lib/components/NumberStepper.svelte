<script lang="ts" module>
  import type { Snippet } from 'svelte';

  import type { TextFieldProps } from './TextField.svelte';

  type NumberStepperOwnProps = {
    /** Bindable */
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    class?: string;
    /** Called when the value changes */
    onChange?: (detail: { value: number }) => void;
    prefix?: Snippet;
    suffix?: Snippet;
  };

  export type NumberStepperProps = NumberStepperOwnProps &
    Omit<TextFieldProps, keyof NumberStepperOwnProps | 'type' | 'align'>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';
  import { step as stepUtil } from '@layerstack/utils/number';
  import { selectOnFocus } from '@layerstack/svelte-attachments';

  import Button from './Button.svelte';
  import TextField from './TextField.svelte';
  import { getComponentClasses } from './theme.js';
  import { getSettings } from './settingsState.svelte.js';

  let {
    value = $bindable(0),
    min,
    max,
    step = 1,
    class: className,
    onChange,
    prefix: prefixSnippet,
    suffix: suffixSnippet,
    ...restProps
  }: NumberStepperProps = $props();

  const settings = getSettings();
  const icons = $derived(settings.icons);
  const settingsClasses = getComponentClasses('NumberStepper');

  // The +/- buttons set `value` directly rather than going through the input, so watch the value
  // itself instead of relying on `TextField`'s own change callback
  let lastValue = value;
  $effect(() => {
    if (value === lastValue) return;
    lastValue = value;
    onChange?.({ value });
  });
</script>

<TextField
  {...restProps}
  type="integer"
  bind:value={() => value, (next) => (value = Number(next ?? 0))}
  {min}
  {max}
  {step}
  align="center"
  class={cls('NumberStepper w-24', settingsClasses.root, className)}
  {@attach selectOnFocus()}
>
  {#snippet prepend()}
    <Button
      icon={icons.minus}
      onclick={() => (value = stepUtil(value, -step))}
      size="sm"
      disabled={min != null && value <= min}
    />
  {/snippet}

  {#snippet append()}
    <Button
      icon={icons.plus}
      onclick={() => (value = stepUtil(value, step))}
      size="sm"
      disabled={max != null && value >= max}
    />
  {/snippet}

  {#snippet prefix()}
    {@render prefixSnippet?.()}
  {/snippet}

  {#snippet suffix()}
    {@render suffixSnippet?.()}
  {/snippet}
</TextField>
