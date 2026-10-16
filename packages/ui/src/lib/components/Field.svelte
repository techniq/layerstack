<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes, MouseEventHandler } from 'svelte/elements';

  import type { IconProp, LabelPlacement } from '../types/index.js';

  type FieldOwnProps = {
    label?: string;
    labelPlacement?: LabelPlacement;
    /** Bindable.  Cleared by the `clearable` button */
    value?: any;
    placeholder?: string;
    error?: string | string[] | boolean;
    hint?: string;
    disabled?: boolean;
    /** Show a button to clear the value when one is set */
    clearable?: boolean;
    /** Remove the background and rounding, leaving only layout */
    base?: boolean;
    rounded?: boolean;
    /** Reduce vertical padding */
    dense?: boolean;
    icon?: IconProp | null;
    iconRight?: IconProp | null;
    center?: boolean;
    id?: string;
    class?: string;
    classes?: {
      root?: string;
      container?: string;
      label?: string;
      input?: string;
      error?: string;
      prepend?: string;
      append?: string;
    };

    /** Called when the clear button is pressed */
    onClear?: () => void;
    /** Called when the input area is clicked */
    onclick?: MouseEventHandler<HTMLDivElement>;

    /** The control itself.  Receives the generated `id` to associate with the label */
    children?: Snippet<[{ id: string }]>;
    prepend?: Snippet;
    append?: Snippet;
    prefix?: Snippet;
    suffix?: Snippet;
    /** Rendered at the end of the root `<label>` (ex. a menu anchored to the field) */
    root?: Snippet;
  };

  export type FieldProps = FieldOwnProps &
    Omit<HTMLAttributes<HTMLLabelElement>, keyof FieldOwnProps>;
</script>

<script lang="ts">
  import { uniqueId } from '@layerstack/utils';
  import { cls } from '@layerstack/tailwind';

  import { DEFAULT_LABEL_PLACEMENT } from '../types/index.js';
  import { getComponentSettings, getSettings } from './settingsState.svelte.js';
  import { asIconData } from '../utils/icons.js';
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';

  const settings = getSettings();
  const { classes: settingsClasses, defaults } = getComponentSettings('Field');

  let {
    label = '',
    labelPlacement = defaults.labelPlacement ?? DEFAULT_LABEL_PLACEMENT,
    value = $bindable(null),
    placeholder = '',
    error = '',
    hint = '',
    disabled = false,
    clearable = false,
    base = false,
    rounded = false,
    dense = false,
    icon = null,
    iconRight = null,
    center = false,
    id = uniqueId('field-'),
    class: className,
    classes = {},
    onClear,
    onclick,
    children,
    prepend,
    append,
    prefix,
    suffix,
    root,
    ...restProps
  }: FieldProps = $props();

  const icons = $derived(settings.icons);

  const hasValue = $derived(
    Array.isArray(value)
      ? value.length > 0
      : !!value /* anything truthy such as an object, non-empty string, etc */
  );
  const hasInsetLabel = $derived(['inset', 'float'].includes(labelPlacement) && label !== '');

  const hasPrepend = $derived(prepend !== undefined || icon != null);
  const hasAppend = $derived(
    append !== undefined || iconRight != null || clearable || Boolean(error)
  );

  let labelEl: HTMLLabelElement | null = $state(null);
</script>

<label
  for={id}
  role="group"
  bind:this={labelEl}
  {...restProps}
  class={cls(
    'Field',
    'group flex gap-1',
    labelPlacement !== 'left' ? 'flex-col' : 'items-center',
    error ? '[--color:var(--color-danger)]' : '[--color:var(--color-primary)]',
    disabled && 'opacity-50 pointer-events-none',
    !base && (rounded ? 'rounded-full' : 'rounded-sm'),
    settingsClasses.root,
    classes.root,
    className
  )}
>
  {#if label && ['top', 'left'].includes(labelPlacement)}
    <span
      class={cls(
        'label',
        'block text-sm font-medium',
        'truncate group-hover:text-surface-content/70 group-focus-within:text-primary group-focus-within:group-hover:text-(--color) cursor-pointer',
        error ? 'text-danger/80' : 'text-surface-content/50',
        `placement-${labelPlacement}`,
        settingsClasses.label,
        classes.label
      )}
    >
      {label}
    </span>
  {/if}

  <div class="flex-1">
    <div
      class={cls(
        'border py-0 transition-shadow',
        disabled ? '' : 'hover:shadow-sm',
        disabled ? '' : error ? 'hover:border-danger' : 'hover:border-surface-content',
        {
          'px-2': !rounded,
          'px-6': rounded && !hasPrepend,
        },
        !base && ['bg-surface-100', rounded ? 'rounded-full' : 'rounded-sm'],
        error && 'border-danger',
        'group-focus-within:shadow-md group-focus-within:border-[var(--color)]',
        settingsClasses.container,
        classes.container
      )}
    >
      <div class="flex items-center">
        {#if hasPrepend}
          <div
            class={cls(
              'prepend flex items-center whitespace-nowrap',
              settingsClasses.prepend,
              classes.prepend
            )}
          >
            {@render prepend?.()}

            {#if icon}
              <span class={cls('mr-3', rounded && prepend === undefined && 'ml-3')}>
                <Icon data={asIconData(icon)} class="text-surface-content/50" />
              </span>
            {/if}
          </div>
        {/if}

        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="grow inline-grid" {onclick}>
          {#if label && ['inset', 'float'].includes(labelPlacement)}
            <span
              class={cls(
                'label',
                'col-span-full row-span-full z-1 flex items-center h-full truncate origin-top-left transition-all duration-200 group-hover:text-surface-content/70 group-focus-within:text-[var(--color)] group-focus-within:group-hover:text-(--color) cursor-pointer',
                center && 'justify-center',
                error ? 'text-danger/80' : 'text-surface-content/50',
                `placement-${labelPlacement}`,
                (labelPlacement === 'inset' || hasValue) && 'shrink',
                settingsClasses.label,
                classes.label
              )}
            >
              {label}
            </span>
          {/if}

          <div
            class={cls(
              'input col-span-full row-span-full flex items-center',
              hasInsetLabel && 'pt-4',
              dense ? 'my-1' : 'my-2',
              center && 'text-center',
              settingsClasses.input,
              classes.input
            )}
          >
            {@render prefix?.()}

            {#if children}
              {@render children({ id })}
            {:else if value}
              {value}
            {:else if placeholder}
              <span class="text-surface-content/50">
                {placeholder}
              </span>
            {:else}
              &nbsp;
            {/if}

            {@render suffix?.()}
          </div>
        </div>

        {#if hasAppend}
          <div
            class={cls(
              'append flex items-center whitespace-nowrap',
              settingsClasses.append,
              classes.append
            )}
          >
            {#if clearable && hasValue}
              <Button
                icon={icons.close}
                {disabled}
                class="text-surface-content/50 p-1"
                onclick={() => {
                  value = Array.isArray(value) ? [] : typeof value === 'string' ? '' : null;
                  onClear?.();
                  labelEl?.focus();
                }}
              />
            {/if}

            {@render append?.()}

            {#if error}
              <Icon data={icons.info} class="text-danger" />
            {:else if iconRight}
              <Icon data={asIconData(iconRight)} class="text-surface-content/50" />
            {/if}
          </div>
        {/if}
      </div>
    </div>
    <div
      class={cls(
        error ? 'error' : 'hint',
        'text-xs ml-2 transition-transform ease-out overflow-hidden origin-top transform group-focus-within:scale-y-100',
        error ? 'text-danger' : 'text-surface-content/50 scale-y-0',
        settingsClasses.error,
        classes.error
      )}
    >
      {error && error != true ? error : hint}
    </div>
  </div>

  {@render root?.()}
</label>

<style>
  .Field:focus-within .label.placement-float,
  .label.shrink {
    transform: scale(0.75);
    width: 133%; /* offset 75% scale */
    height: 32px;
  }
</style>
