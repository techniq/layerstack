<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import { SelectionState, UniqueState } from '@layerstack/svelte-state';

  import type { MenuOption } from '../types/index.js';
  import type { ButtonProps } from './Button.svelte';
  import type { MultiSelectOptionProps } from './MultiSelectOption.svelte';

  export type MultiSelectChangeContext<TValue> = {
    value: TValue[];
    selection: SelectionState<TValue, boolean>;
    indeterminate: Set<TValue>;
    original: { selected: MenuOption<TValue>[]; unselected: MenuOption<TValue>[] };
  };

  /** Context handed to the option snippet */
  export type MultiSelectOptionContext<TValue> = {
    option: MenuOption<TValue>;
    label: string;
    value: TValue;
    checked: boolean;
    indeterminate: boolean;
    disabled: boolean;
    onChange: () => void;
  };

  export type MultiSelectSearch<TValue> = (
    text: string,
    options: MenuOption<TValue>[]
  ) => Promise<MenuOption<TValue>[]> | MenuOption<TValue>[];

  export type MultiSelectProps<TValue> = {
    options: MenuOption<TValue>[];
    /** Bindable */
    value?: TValue[];
    /** Values shown as partially selected */
    indeterminateSelected?: TValue[];
    /** Flip animation duration when options reorder */
    duration?: number;
    autoFocusSearch?: boolean;
    placeholder?: string;
    optionProps?: Partial<MultiSelectOptionProps>;
    /** Amortize rendering of a large option list */
    infiniteScroll?: boolean;
    /** Maximum number of options that can be selected */
    max?: number;
    /** Keep the original option order rather than floating selected options to the top */
    maintainOrder?: boolean;
    /** Apply changes immediately, or wait for the Apply button */
    mode?: 'actions' | 'immediate';
    /** `false` hides the search box; a function replaces the default filter */
    search?: MultiSelectSearch<TValue> | boolean;
    /** Bindable */
    searchText?: string;
    cancelButtonProps?: ButtonProps;
    applyButtonProps?: ButtonProps;
    class?: string;
    classes?: {
      root?: string;
      search?: string;
      options?: string;
      actions?: string;
    };
    /** Awaited before the change is reported — show a spinner on Apply while it runs */
    onApply?: (ctx: MultiSelectChangeContext<TValue>) => void | Promise<void>;
    onChange?: (ctx: MultiSelectChangeContext<TValue>) => void;
    onCancel?: () => void;
    beforeOptions?: Snippet<[{ selection: SelectionState<TValue, boolean> }]>;
    afterOptions?: Snippet<[{ selection: SelectionState<TValue, boolean> }]>;
    option?: Snippet<[MultiSelectOptionContext<TValue>]>;
    actions?: Snippet<[{ selection: SelectionState<TValue, boolean>; searchText: string }]>;
  };
</script>

<script lang="ts" generics="TValue">
  import { untrack } from 'svelte';
  import { flip } from 'svelte/animate';
  import { partition, isEqual } from 'lodash-es';
  import { cls } from '@layerstack/tailwind';

  import Button from './Button.svelte';
  import InfiniteScroll from './InfiniteScroll.svelte';
  import MultiSelectOption from './MultiSelectOption.svelte';
  import TextField from './TextField.svelte';
  import { getComponentClasses } from './theme.js';
  import { getSettings } from './settingsState.svelte.js';

  let {
    options,
    value = $bindable([]),
    indeterminateSelected = [],
    duration = 200,
    autoFocusSearch = false,
    placeholder = 'Search items',
    optionProps,
    infiniteScroll = false,
    max,
    maintainOrder = false,
    mode = 'actions',
    search = false,
    searchText = $bindable(''),
    cancelButtonProps,
    applyButtonProps,
    class: className,
    classes = {},
    onApply,
    onChange,
    onCancel,
    beforeOptions,
    afterOptions,
    option: optionSnippet,
    actions,
  }: MultiSelectProps<TValue> = $props();

  const settingsClasses = getComponentClasses('MultiSelect');
  const settings = getSettings();
  const icons = $derived(settings.icons);

  // svelte-ignore state_referenced_locally
  const selection = new SelectionState<TValue, boolean>({ initial: value, max });
  // svelte-ignore state_referenced_locally
  const indeterminate = new UniqueState<TValue>(indeterminateSelected);

  let applying = $state(false);

  /** Snapshot of the last applied selection — replaces Svelte UX's `dirtyStore`/`changeStore` */
  let appliedSelection = $state<TValue[]>([...value]);

  const selected = $derived(selection.current as TValue[]);
  const isSelectionDirty = $derived(!isEqual([...selected].sort(), [...appliedSelection].sort()));

  $effect(() => {
    selection.max = max;
  });

  // Adopt `value` only when it changes from outside — comparing against the live selection instead
  // would undo the user's own toggles before they are applied
  let lastValue = $state.snapshot(value) as TValue[];
  $effect(() => {
    const next = value;
    if (isEqual([...next].sort(), [...lastValue].sort())) return;

    lastValue = [...next];
    untrack(() => {
      selection.current = next;
      appliedSelection = [...next];
    });
  });

  // Partition by the *applied* selection, so options do not jump while being toggled
  const partitioned = $derived(partition(options, (o) => appliedSelection.includes(o.value)));
  const selectedOptions = $derived(partitioned[0]);
  const unselectedOptions = $derived(partitioned[1]);

  const usingSearch = $derived(search !== false);

  function defaultSearch(text: string, opts: MenuOption<TValue>[]) {
    if (text === '' || opts.length === 0) return opts;

    const words = text?.toLowerCase().split(' ') ?? [];
    return opts.filter((option) => {
      const label = option.label.toLowerCase();
      return words.every((word) => label.includes(word));
    });
  }

  const searchFn = $derived(typeof search === 'function' ? search : defaultSearch);

  let filteredOptions = $state<MenuOption<TValue>[]>([]);
  let filteredSelectedOptions = $state<MenuOption<TValue>[]>([]);
  let filteredUnselectedOptions = $state<MenuOption<TValue>[]>([]);

  $effect(() => {
    // Track the inputs so the filter re-runs when any of them change
    const text = searchText;
    const all = options ?? [];
    const sel = selectedOptions ?? [];
    const unsel = unselectedOptions ?? [];

    if (!usingSearch) {
      filteredOptions = [...all];
      filteredSelectedOptions = [...sel];
      filteredUnselectedOptions = [...unsel];
      return;
    }

    let cancelled = false;
    Promise.all([searchFn(text, all), searchFn(text, sel), searchFn(text, unsel)]).then(
      ([a, s, u]) => {
        if (cancelled) return;
        filteredOptions = a;
        filteredSelectedOptions = s;
        filteredUnselectedOptions = u;
      }
    );
    return () => {
      cancelled = true;
    };
  });

  function changeContext(): MultiSelectChangeContext<TValue> {
    return {
      value: selected,
      selection,
      indeterminate: indeterminate.current,
      original: { selected: selectedOptions, unselected: unselectedOptions },
    };
  }

  async function applyChange() {
    applying = true;
    const ctx = changeContext();
    await onApply?.(ctx);
    applying = false;

    value = ctx.value;
    lastValue = [...ctx.value];
    appliedSelection = [...ctx.value];
    onChange?.(ctx);
    searchText = '';
  }

  // In `immediate` mode, apply as soon as the selection differs from what was last applied
  $effect(() => {
    if (mode !== 'immediate') return;
    if (!isSelectionDirty || applying) return;
    applyChange();
  });

  function toggleOption(optionValue: TValue) {
    // Clear the indeterminate marker and toggle as usual
    indeterminate.delete(optionValue);
    selection.toggle(optionValue);
  }

  export function clear() {
    selection.clear();
    applyChange();
  }
</script>

{#if usingSearch}
  <div
    class={cls(
      'search',
      'border-b border-surface-content/10 pb-2',
      settingsClasses.search,
      classes.search
    )}
  >
    <TextField
      {placeholder}
      iconRight={icons.search}
      bind:value={() => searchText, (next) => (searchText = String(next ?? ''))}
      autofocus={{ delay: 100, disabled: !autoFocusSearch }}
    />
  </div>
{/if}

<div
  role="listbox"
  aria-multiselectable="true"
  class={cls(
    'MultiSelect options',
    'overflow-auto py-1',
    settingsClasses.options,
    classes.options,
    settingsClasses.root,
    classes.root,
    className
  )}
>
  {@render beforeOptions?.({ selection })}

  <!-- All options, or the initially selected ones, depending on `maintainOrder` -->
  <InfiniteScroll
    items={maintainOrder ? filteredOptions : filteredSelectedOptions}
    disabled={!infiniteScroll}
  >
    {#snippet children({ visibleItems })}
      {#each visibleItems as option (option.value)}
        {@const ctx = {
          option,
          label: option.label,
          value: option.value,
          checked: selection.isSelected(option.value),
          indeterminate: indeterminate.current.has(option.value),
          disabled: selection.isDisabled(option.value),
          onChange: () => toggleOption(option.value),
        }}
        <div animate:flip={{ duration }}>
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
        </div>
      {:else}
        {#if maintainOrder && !filteredOptions.length}
          <div class="text-surface-content/50 text-xs py-2 px-4 mb-1">
            There are no matching items.
          </div>
        {/if}
      {/each}
    {/snippet}
  </InfiniteScroll>

  {#if !maintainOrder}
    {#if filteredSelectedOptions.length && filteredUnselectedOptions.length}
      <!-- separator between selected and unselected -->
      <div class="border-b my-1 border-surface-content/10"></div>
    {/if}

    <InfiniteScroll items={filteredUnselectedOptions} disabled={!infiniteScroll}>
      {#snippet children({ visibleItems })}
        {#each visibleItems as option (option.value)}
          {@const ctx = {
            option,
            label: option.label,
            value: option.value,
            checked: selection.isSelected(option.value),
            indeterminate: indeterminate.current.has(option.value),
            disabled: selection.isDisabled(option.value),
            onChange: () => toggleOption(option.value),
          }}
          <div animate:flip={{ duration }}>
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
          </div>
        {:else}
          {#if !filteredSelectedOptions.length}
            <div class="text-surface-content/50 text-xs py-2 px-4 mb-1">
              There are no matching items.
            </div>
          {/if}
        {/each}
      {/snippet}
    </InfiniteScroll>
  {/if}

  {@render afterOptions?.({ selection })}
</div>

<div
  class={cls(
    'actions',
    'flex items-center justify-end',
    '[&:not(:has(>:first-child))]:hidden border-t border-surface-content/10 pt-2',
    settingsClasses.actions,
    classes.actions
  )}
>
  {@render actions?.({ selection, searchText })}

  {#if mode === 'actions'}
    <div>
      <Button
        class="px-6"
        disabled={applying}
        onclick={() => {
          selection.current = appliedSelection;
          onCancel?.();
        }}
        {...cancelButtonProps}
      >
        Cancel
      </Button>

      <Button
        variant="fill"
        color="primary"
        class="px-6"
        loading={applying}
        disabled={!isSelectionDirty || applying}
        onclick={() => applyChange()}
        {...applyButtonProps}
      >
        Apply
      </Button>
    </div>
  {/if}
</div>
