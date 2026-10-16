<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import type { ThemeColors } from '@layerstack/tailwind';

  type SwitchOwnProps = {
    id?: string;
    name?: string;
    value?: any;
    /** Bindable.  `null` renders an indeterminate state */
    checked?: boolean | null;
    required?: boolean;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    color?: ThemeColors;
    class?: string;
    classes?: {
      root?: string;
      input?: string;
      switch?: string;
      toggle?: string;
    };
    /** Rendered inside the toggle knob */
    children?: Snippet<[{ checked: boolean | null; value: any }]>;
  };

  export type SwitchProps = SwitchOwnProps & Omit<HTMLInputAttributes, keyof SwitchOwnProps>;
</script>

<script lang="ts">
  import { uniqueId } from '@layerstack/utils';
  import { cls } from '@layerstack/tailwind';

  import { getComponentClasses } from './theme.js';

  let {
    id = uniqueId('switch-'),
    name = '',
    value,
    checked = $bindable(false),
    required = false,
    disabled = false,
    size = 'lg',
    color = 'primary',
    class: className,
    classes = {},
    onchange,
    children,
    ...restProps
  }: SwitchProps = $props();

  const settingsClasses = getComponentClasses('Switch');
</script>

<div class={cls('Switch', 'inline-block', settingsClasses.root, classes.root)}>
  <input
    {id}
    {name}
    type="checkbox"
    checked={checked ?? false}
    {value}
    {required}
    {disabled}
    {...restProps}
    class={cls('peer appearance-none block h-0', settingsClasses.input, classes.input)}
    onchange={(e) => {
      checked = e.currentTarget.checked;
      onchange?.(e);
    }}
  />

  <label
    for={id}
    data-checked={checked}
    class={cls(
      'switch',
      'group border rounded-full grid align-items p-[2px] transition-shadow',
      {
        'w-6 h-4': size === 'sm',
        'w-8 h-5': size === 'md',
        'w-10 h-6': size === 'lg',
      },
      checked &&
        {
          primary: 'bg-primary border-primary',
          secondary: 'bg-secondary border-secondary',
          accent: 'bg-accent border-accent',
          neutral: 'bg-neutral border-neutral',
          info: 'bg-info border-info',
          success: 'bg-success border-success',
          warning: 'bg-warning border-warning',
          danger: 'bg-danger border-danger',
        }[color],
      {
        primary: 'ring-primary/60',
        secondary: 'ring-secondary/60',
        accent: 'ring-accent/60',
        neutral: 'ring-neutral/60',
        info: 'ring-info/60',
        success: 'ring-success/60',
        warning: 'ring-warning/60',
        danger: 'ring-danger/60',
      }[color],
      checked === false && 'bg-surface-content/20',
      disabled ? 'opacity-50' : 'cursor-pointer peer-focus-visible:ring-2 ring-offset-1',
      settingsClasses.switch,
      classes.switch,
      className
    )}
  >
    <div
      data-checked={checked}
      class={cls(
        'toggle w-1/2 aspect-square h-full rounded-full transition-all duration-200 bg-surface-100 grid items-center justify-center transform',
        'group-active:w-[60%] aspect-auto',
        checked && 'translate-x-full group-active:translate-x-[65%]',
        checked === null && 'border',
        settingsClasses.toggle,
        classes.toggle
      )}
    >
      {@render children?.({ checked, value })}
    </div>
  </label>
</div>
