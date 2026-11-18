<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';

  type CheckboxOwnProps = {
    id?: string;
    name?: string;
    value?: any;
    /** Bindable.  Derived from `group` when one is supplied */
    checked?: boolean;
    /** Bindable.  Membership of this checkbox's `value` drives `checked` */
    group?: any[] | null;
    /** Show the indeterminate (dash) icon instead of the check */
    indeterminate?: boolean;
    required?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    circle?: boolean;
    class?: string;
    classes?: {
      root?: string;
      input?: string;
      checkbox?: string;
      label?: string;
      icon?: string;
    };
    children?: Snippet;
  };

  export type CheckboxProps = CheckboxOwnProps & Omit<HTMLInputAttributes, keyof CheckboxOwnProps>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';
  import { uniqueId } from '@layerstack/utils';

  import { getComponentClasses } from './theme.js';
  import { getSettings } from './settingsState.svelte.js';

  let {
    id = uniqueId('checkbox-'),
    name = '',
    value,
    checked = $bindable(false),
    group = $bindable(null),
    indeterminate = false,
    required = false,
    disabled = false,
    fullWidth = false,
    size = 'sm',
    circle = false,
    class: className,
    classes = {},
    onchange,
    children,
    ...restProps
  }: CheckboxProps = $props();

  const settings = getSettings();
  const settingsClasses = getComponentClasses('Checkbox');

  // When part of a group, membership decides the checked state
  const isChecked = $derived(group !== null ? (group?.includes(value) ?? false) : checked);

  const StateIcon = $derived(indeterminate ? settings.icons.minus : settings.icons.check);
</script>

<div
  class={cls(
    'Checkbox',
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
    type="checkbox"
    checked={isChecked}
    {value}
    {required}
    {disabled}
    {...restProps}
    class={cls('input', 'peer appearance-none absolute', settingsClasses.input, classes.input)}
    onchange={(e) => {
      const next = e.currentTarget.checked;
      checked = next;
      if (group !== null) {
        group = next ? [...(group ?? []), value] : (group ?? []).filter((v) => v !== value);
      }
      onchange?.(e);
    }}
  />
  <label
    for={id}
    class={cls(
      'checkbox',
      'inline-grid place-items-center border-2',
      circle ? 'rounded-full' : 'rounded-sm',
      'peer-disabled:opacity-50 transition-shadow duration-300',
      !disabled &&
        'peer-hover:border-primary peer-focus-visible:border-primary peer-focus-visible:ring-2 ring-primary/60 ring-offset-1',
      !isChecked && !disabled && 'peer-hover:bg-primary/10',
      isChecked
        ? disabled
          ? 'bg-surface-content border-surface-content'
          : 'bg-primary border-primary'
        : 'border-surface-content/50',
      settingsClasses.checkbox,
      classes.checkbox
    )}
  >
    <StateIcon
      class={cls(
        'icon',
        'pointer-events-none text-primary-content transition-transform leading-none',
        isChecked ? 'scale-100' : 'scale-0',
        {
          xs: 'size-3',
          sm: 'size-[14px]',
          md: 'size-4',
          lg: 'size-[18px]',
        }[size],
        settingsClasses.icon,
        classes.icon
      )}
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
