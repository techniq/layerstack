<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  import type { CheckboxProps } from './Checkbox.svelte';

  type MultiSelectOptionOwnProps = {
    /** Bindable */
    checked?: boolean;
    /** Bindable */
    indeterminate?: boolean;
    disabled?: boolean;
    variant?: 'checkbox' | 'checkmark' | 'fill';
    class?: string;
    classes?: {
      root?: string;
      checkbox?: CheckboxProps['classes'];
      container?: string;
    };
    /** Called when the option is toggled */
    onChange?: () => void;
    children?: Snippet;
    actions?: Snippet;
  };

  export type MultiSelectOptionProps = MultiSelectOptionOwnProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof MultiSelectOptionOwnProps>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  import Button from './Button.svelte';
  import Checkbox from './Checkbox.svelte';
  import { getComponentClasses } from './theme.js';
  import { getSettings } from './settingsState.svelte.js';

  let {
    checked = $bindable(false),
    indeterminate = $bindable(false),
    disabled = false,
    variant = 'checkbox',
    class: className,
    classes = {},
    onChange,
    children,
    actions,
    ...restProps
  }: MultiSelectOptionProps = $props();

  const settingsClasses = getComponentClasses('MultiSelectOption');
  const settings = getSettings();
  const icons = $derived(settings.icons);
</script>

<div
  role="option"
  aria-selected={checked}
  {...restProps}
  class={cls(
    'MultiSelectOption',
    'grid grid-cols-[1fr_auto]',
    settingsClasses.root,
    classes.root,
    className
  )}
>
  {#if variant === 'checkbox'}
    <Checkbox
      bind:checked
      {indeterminate}
      onchange={() => onChange?.()}
      {disabled}
      classes={{
        root: 'px-2 rounded-sm hover:bg-surface-content/5',
        label: 'py-2',
        ...settingsClasses.checkbox,
        ...classes.checkbox,
      }}
    >
      <div
        class={cls(
          'ml-1 inline-block text-sm text-surface-content',
          !disabled && 'cursor-pointer',
          settingsClasses.container,
          classes.container
        )}
      >
        {@render children?.()}
      </div>
    </Checkbox>
  {:else if variant === 'checkmark'}
    <Button
      icon={checked ? icons.check : 'M0'}
      {disabled}
      class={cls(
        'px-2 text-sm font-normal text-surface-content hover:bg-surface-content/5',
        'justify-start',
        settingsClasses.container,
        classes.container
      )}
      onclick={() => onChange?.()}
    >
      {@render children?.()}
    </Button>
  {:else if variant === 'fill'}
    <Button
      {disabled}
      class={cls(
        'px-2 my-px text-sm font-normal',
        'justify-start',
        settingsClasses.container,
        classes.container
      )}
      variant={checked ? 'fill-light' : 'default'}
      color={checked ? 'primary' : 'default'}
      onclick={() => onChange?.()}
    >
      {@render children?.()}
    </Button>
  {/if}

  {@render actions?.()}
</div>
