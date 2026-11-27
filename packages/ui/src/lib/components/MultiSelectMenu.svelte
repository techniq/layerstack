<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { Placement } from '@floating-ui/dom';
  import type { SelectionState } from '@layerstack/svelte-state';

  import type { MenuProps } from './Menu.svelte';
  import type {
    MultiSelectChangeContext,
    MultiSelectOptionContext,
    MultiSelectProps,
  } from './MultiSelect.svelte';
  import type { MultiSelectOptionProps } from './MultiSelectOption.svelte';

  export type MultiSelectMenuProps<TValue> = {
    options: MultiSelectProps<TValue>['options'];
    /** Bindable */
    value?: TValue[];
    mode?: MultiSelectProps<TValue>['mode'];
    maintainOrder?: boolean;
    indeterminateSelected?: TValue[];
    /** Bindable */
    open?: boolean;
    duration?: number;
    placement?: Placement;
    autoPlacement?: boolean;
    search?: MultiSelectProps<TValue>['search'];
    autoFocusSearch?: boolean;
    placeholder?: string;
    infiniteScroll?: boolean;
    /** Bindable */
    searchText?: string;
    /** Maximum number of options that can be selected */
    max?: number;
    optionProps?: Partial<MultiSelectOptionProps>;
    class?: string;
    classes?: {
      root?: string;
      menu?: string;
      multiSelect?: MultiSelectProps<TValue>['classes'];
    };
    /** Bindable.  The `<menu>` element */
    menuItemsEl?: HTMLMenuElement;
    /** Bindable.  The scrollable options container */
    menuOptionsEl?: HTMLDivElement;
    onApply?: MultiSelectProps<TValue>['onApply'];
    onChange?: (ctx: MultiSelectChangeContext<TValue>) => void;
    onCancel?: () => void;
    onClose?: () => void;
    beforeOptions?: Snippet<[{ selection: SelectionState<TValue, boolean> }]>;
    afterOptions?: Snippet<[{ selection: SelectionState<TValue, boolean> }]>;
    option?: Snippet<[MultiSelectOptionContext<TValue>]>;
    actions?: Snippet<[{ selection: SelectionState<TValue, boolean>; searchText: string }]>;
  } & Omit<MenuProps, 'children' | 'classes' | 'open' | 'placement' | 'autoPlacement'>;
</script>

<script lang="ts" generics="TValue">
  import { cls } from '@layerstack/tailwind';

  import Menu from './Menu.svelte';
  import MultiSelect from './MultiSelect.svelte';
  import MultiSelectOption from './MultiSelectOption.svelte';
  import { getComponentClasses } from './theme.js';

  let {
    options,
    value = $bindable([]),
    mode,
    maintainOrder,
    indeterminateSelected = [],
    open = $bindable(false),
    duration = 200,
    placement = 'bottom-start',
    autoPlacement = true,
    search = false,
    autoFocusSearch,
    placeholder,
    infiniteScroll = false,
    searchText = $bindable(''),
    max,
    optionProps,
    class: className,
    classes = {},
    menuItemsEl = $bindable(),
    menuOptionsEl = $bindable(),
    onApply,
    onChange,
    onCancel,
    onClose,
    beforeOptions,
    afterOptions,
    option: optionSnippet,
    actions,
    ...restProps
  }: MultiSelectMenuProps<TValue> = $props();

  const settingsClasses = getComponentClasses('MultiSelectMenu');

  const resolvedAutoFocusSearch = $derived(autoFocusSearch ?? Boolean(search));
</script>

<Menu
  bind:open
  bind:menuItemsEl
  explicitClose
  {placement}
  {autoPlacement}
  {onClose}
  {...restProps}
  classes={{
    root: cls('MultiSelectMenu', settingsClasses.root, classes.root, className),
    menu: cls('flex flex-col', settingsClasses.menu, classes.menu),
  }}
>
  {#snippet children({ close })}
    <MultiSelect
      {options}
      bind:value
      {mode}
      {maintainOrder}
      {indeterminateSelected}
      {max}
      {duration}
      {search}
      autoFocusSearch={resolvedAutoFocusSearch}
      {placeholder}
      {infiniteScroll}
      bind:searchText
      {optionProps}
      {onApply}
      classes={{
        search: 'p-2',
        options: 'px-2',
        actions: 'p-2',
        ...settingsClasses.multiSelect,
        ...classes.multiSelect,
      }}
      onCancel={() => {
        if (mode !== 'immediate') close();
        onCancel?.();
      }}
      onChange={(ctx) => {
        if (mode !== 'immediate') close();
        onChange?.(ctx);
      }}
      {beforeOptions}
      {afterOptions}
      {actions}
    >
      {#snippet option(ctx)}
        {#if optionSnippet}
          {@render optionSnippet(ctx)}
        {:else}
          <MultiSelectOption
            checked={ctx.checked}
            indeterminate={ctx.indeterminate}
            disabled={ctx.disabled}
            {...optionProps}
            onChange={ctx.onChange}
          >
            {ctx.label}
          </MultiSelectOption>
        {/if}
      {/snippet}
    </MultiSelect>
  {/snippet}
</Menu>
