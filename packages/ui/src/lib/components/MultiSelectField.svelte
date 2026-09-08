<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { Placement } from '@floating-ui/dom';
  import type { SelectionState } from '@layerstack/svelte-state';

  import type { MenuOption } from '../types/index.js';
  import type { MultiSelectChangeContext, MultiSelectOptionContext } from './MultiSelect.svelte';
  import type { MultiSelectMenuProps } from './MultiSelectMenu.svelte';
  import type { MultiSelectOptionProps } from './MultiSelectOption.svelte';
  import type { TextFieldProps } from './TextField.svelte';

  export type MultiSelectFieldProps<TValue> = {
    options: MenuOption<TValue>[];
    /** Bindable */
    value?: TValue[];
    mode?: MultiSelectMenuProps<TValue>['mode'];
    maintainOrder?: boolean;
    indeterminateSelected?: TValue[];
    /** Maximum number of options that can be selected */
    max?: number;
    placement?: Placement;
    infiniteScroll?: boolean;
    optionProps?: Partial<MultiSelectOptionProps>;
    label?: string;
    placeholder?: string;
    loading?: boolean;
    disabled?: boolean;
    icon?: TextFieldProps['icon'];
    clearable?: boolean;
    base?: boolean;
    rounded?: boolean;
    dense?: boolean;
    /** Summary shown in the field when closed.  `options` are the *selected* options */
    formatSelected?: (ctx: { value: TValue[]; options: MenuOption<TValue>[] }) => string;
    class?: string;
    classes?: {
      root?: string;
      multiSelectMenu?: MultiSelectMenuProps<TValue>['classes'];
      field?: string | TextFieldProps['classes'];
      actions?: string;
    };
    menuProps?: Omit<MultiSelectMenuProps<TValue>, 'options'>;
    onApply?: MultiSelectMenuProps<TValue>['onApply'];
    onChange?: (detail: { value: TValue[] }) => void;
    prepend?: Snippet;
    append?: Snippet;
    beforeOptions?: Snippet<[{ selection: SelectionState<TValue, boolean> }]>;
    afterOptions?: Snippet<[{ selection: SelectionState<TValue, boolean> }]>;
    option?: Snippet<[MultiSelectOptionContext<TValue>]>;
    actions?: Snippet<[{ selection: SelectionState<TValue, boolean>; searchText: string }]>;
  } & Omit<
    TextFieldProps,
    'value' | 'label' | 'placeholder' | 'icon' | 'classes' | 'children' | 'onChange'
  >;
</script>

<script lang="ts" generics="TValue">
  import { cls, clsMerge, normalizeClasses } from '@layerstack/tailwind';

  import Button from './Button.svelte';
  import MultiSelectMenu from './MultiSelectMenu.svelte';
  import ProgressCircle from './ProgressCircle.svelte';
  import TextField from './TextField.svelte';
  import { getComponentSettings, getSettings } from './settingsState.svelte.js';

  const settings = getSettings();
  const { classes: settingsClasses, defaults } = getComponentSettings('MultiSelectField');

  let {
    options,
    value = $bindable([]),
    mode,
    maintainOrder,
    indeterminateSelected = [],
    max,
    placement = 'bottom-start',
    infiniteScroll = false,
    optionProps,
    label = '',
    placeholder = '',
    loading = false,
    disabled = false,
    icon = null,
    clearable = true,
    base = false,
    rounded = false,
    dense = false,
    formatSelected = ({ value }) => `${value?.length} selected`,
    class: className,
    classes = {},
    menuProps,
    onApply,
    onChange,
    prepend: prependSnippet,
    append: appendSnippet,
    beforeOptions,
    afterOptions,
    option: optionSnippet,
    actions,
    ...restProps
  }: MultiSelectFieldProps<TValue> = $props();

  const icons = $derived(settings.icons);

  let open = $state(false);
  let searchText = $state('');
  let inputEl = $state<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // While closed, the field shows a summary of the selection instead of the search text
  $effect(() => {
    if (open) return;
    const selectedOptions = options.filter((o) => value?.includes(o.value));
    searchText = formatSelected({ value, options: selectedOptions });
  });

  function show() {
    inputEl?.focus();
    if (!open) {
      searchText = '';
      open = true;
    }
  }

  function hide() {
    open = false;
  }

  function clear() {
    value = [];
    onChange?.({ value });
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class={cls(
    'MultiSelectField',
    disabled && 'pointer-events-none',
    settingsClasses.root,
    classes.root,
    className
  )}
  onclick={() => show()}
>
  <TextField
    {label}
    {placeholder}
    {base}
    {rounded}
    {icon}
    {dense}
    {disabled}
    bind:value={() => searchText, (next) => (searchText = String(next ?? ''))}
    bind:inputEl
    onfocus={() => show()}
    onChange={({ inputValue }) => (searchText = String(inputValue ?? ''))}
    classes={clsMerge(
      { root: 'h-full' },
      normalizeClasses(settingsClasses.field),
      normalizeClasses(typeof classes.field === 'string' ? { root: classes.field } : classes.field)
    )}
    {...defaults}
    {...restProps}
  >
    {#snippet prepend()}
      {@render prependSnippet?.()}
    {/snippet}

    {#snippet append()}
      <span class="flex items-center">
        {@render appendSnippet?.()}

        {#if loading}
          <span class="inline-block w-[29px] h-[28px] text-center">
            <ProgressCircle size={16} width={2} class="text-surface-content/50" />
          </span>
        {:else if value?.length && clearable}
          <Button
            icon={icons.close}
            class="text-surface-content/50 p-1"
            onclick={(e) => {
              e.stopPropagation();
              clear();
              hide();
            }}
          />
        {:else}
          <Button
            icon={icons.chevronDown}
            class="text-surface-content/50 p-1 transform {open ? 'rotate-180' : ''}"
            tabindex={-1}
            onclick={(e) => {
              e.stopPropagation();
              open ? hide() : show();
            }}
          />
        {/if}
      </span>
    {/snippet}
  </TextField>

  <MultiSelectMenu
    {options}
    bind:value
    {mode}
    {maintainOrder}
    {indeterminateSelected}
    {max}
    {placement}
    {infiniteScroll}
    bind:searchText
    {optionProps}
    {onApply}
    classes={{ ...settingsClasses.multiSelectMenu, ...classes.multiSelectMenu }}
    matchWidth
    bind:open
    onChange={(ctx) => {
      value = ctx.value;
      onChange?.({ value });
    }}
    onClose={hide}
    {beforeOptions}
    {afterOptions}
    {actions}
    option={optionSnippet}
    {...menuProps}
  />
</div>
