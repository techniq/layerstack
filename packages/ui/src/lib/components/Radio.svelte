<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';

  type RadioOwnProps = {
    id?: string;
    name?: string;
    value?: any;
    /** Bindable.  Shared across a set of radios; the one matching `value` is checked */
    group?: any;
    /** Bindable.  Derived from `group` when one is supplied */
    checked?: boolean;
    required?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    class?: string;
    classes?: {
      root?: string;
      input?: string;
      radio?: string;
      label?: string;
      icon?: string;
    };
    children?: Snippet;
  };

  export type RadioProps = RadioOwnProps & Omit<HTMLInputAttributes, keyof RadioOwnProps>;
</script>

<script lang="ts">
  import { uniqueId } from '@layerstack/utils';
  import { cls } from '@layerstack/tailwind';

  import Icon from './Icon.svelte';
  import { getComponentClasses } from './theme.js';

  let {
    id = uniqueId('radio-'),
    name = '',
    value,
    group = $bindable(),
    checked = $bindable(false),
    required = false,
    disabled = false,
    fullWidth = false,
    size = 'sm',
    class: className,
    classes = {},
    children,
    ...restProps
  }: RadioProps = $props();

  const settingsClasses = getComponentClasses('Radio');

  const isChecked = $derived(group !== undefined ? group === value : checked);
</script>

<div
  class={cls(
    'Radio',
    fullWidth ? 'flex' : 'inline-flex',
    'items-center',
    settingsClasses.root,
    classes.root,
    className
  )}
>
  <input
    {id}
    {name}
    type="radio"
    bind:group
    {value}
    {required}
    {disabled}
    {...restProps}
    class={cls('input', 'peer appearance-none absolute', settingsClasses.input, classes.input)}
  />
  <label
    for={id}
    class={cls(
      'radio',
      'inline-grid place-items-center border-2 rounded-full bg-surface-100',
      'peer-disabled:opacity-50 transition-shadow duration-300',
      !disabled &&
        'peer-focus-visible:ring-2 peer-hover:border-primary peer-focus-visible:border-primary ring-primary/20 ring-offset-0',
      !isChecked && !disabled && 'peer-hover:bg-primary/10',
      isChecked
        ? disabled
          ? 'border-surface-content/50'
          : 'border-primary'
        : 'border-surface-content/50',
      settingsClasses.radio,
      classes.radio
    )}
  >
    <Icon
      path="M12 2A10 10 0 0 0 12 22A10 10 0 0 0 12 2Z"
      class={cls(
        'icon',
        'pointer-events-none transition-transform',
        disabled ? 'text-surface-content' : 'text-primary',
        isChecked ? 'scale-100' : 'scale-0',
        settingsClasses.icon,
        classes.icon
      )}
      size={{
        xs: '.75rem',
        sm: '.875rem',
        md: '1rem',
        lg: '1.125rem',
      }[size]}
    />
  </label>

  {#if children}
    <label
      for={id}
      class={cls(
        'label',
        'flex-1',
        'pl-1 peer-disabled:opacity-50',
        {
          xs: 'text-xs',
          sm: 'text-sm',
          md: 'text-md',
          lg: 'text-lg',
        }[size],
        settingsClasses.label,
        classes.label
      )}
    >
      {@render children()}
    </label>
  {/if}
</div>
