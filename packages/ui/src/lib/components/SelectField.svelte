<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { Placement } from '@floating-ui/dom';
  import type { ScrollIntoViewOptions } from '@layerstack/svelte-attachments';

  import type { IconProp, MenuOption } from '../types/index.js';
  import type { MenuProps } from './Menu.svelte';
  import type { TextFieldProps } from './TextField.svelte';

  export type SelectFieldOptionContext<TValue> = {
    option: MenuOption<TValue>;
    index: number;
    selected: MenuOption<TValue> | null | undefined;
    value: TValue | null | undefined;
    highlightIndex: number;
  };

  export type SelectFieldProps<TValue> = {
    options?: MenuOption<TValue>[];
    name?: string;
    label?: string;
    placeholder?: string;
    labelPlacement?: TextFieldProps['labelPlacement'];
    loading?: boolean;
    required?: boolean;
    disabled?: boolean;
    /** Show the value without a chevron or clear button */
    readonly?: boolean;
    icon?: IconProp;
    /** Render the options inline rather than in a menu */
    inlineOptions?: boolean;
    toggleIcon?: IconProp;
    closeIcon?: IconProp;
    /** Show the selected option's icon in the field */
    activeOptionIcon?: boolean;
    clearable?: boolean;
    base?: boolean;
    rounded?: boolean;
    dense?: boolean;
    /** Clear the search text when the menu opens, so all options are shown */
    clearSearchOnOpen?: boolean;
    autofocus?: TextFieldProps['autofocus'];
    /** Show previous/next buttons to step through options */
    stepper?: boolean;
    scrollIntoView?: Partial<ScrollIntoViewOptions>;
    class?: string;
    classes?: {
      root?: string;
      field?: string | TextFieldProps['classes'];
      options?: string;
      option?: string;
      selected?: string;
      group?: string;
      empty?: string;
    };
    placement?: Placement;
    autoPlacement?: boolean;
    matchWidth?: boolean;
    resize?: MenuProps['resize'];
    disableTransition?: boolean;
    menuProps?: MenuProps;
    /** Bindable */
    value?: TValue | null;
    /** Bindable.  The option matching `value` */
    selected?: MenuOption<TValue> | null;
    /** Bindable */
    open?: boolean;
    /** Filter the options against the search text */
    search?: (
      text: string,
      options: MenuOption<TValue>[]
    ) => Promise<MenuOption<TValue>[]> | MenuOption<TValue>[];
    /** Called when the selected value changes */
    onChange?: (detail: { value: TValue | null; option: MenuOption<TValue> | null }) => void;
    /** Called as the search text changes */
    onInputChange?: (text: string) => void;

    prepend?: Snippet;
    append?: Snippet;
    beforeOptions?: Snippet<[{ hide: () => void }]>;
    afterOptions?: Snippet<[{ hide: () => void }]>;
    actions?: Snippet<[{ hide: () => void }]>;
    option?: Snippet<[SelectFieldOptionContext<TValue>]>;
    empty?: Snippet<[{ loading: boolean }]>;
  } & Omit<
    TextFieldProps,
    'value' | 'label' | 'placeholder' | 'icon' | 'classes' | 'children' | 'onChange'
  >;
</script>

<script lang="ts" generics="TValue">
  import { untrack } from 'svelte';
  import { cls, clsMerge, normalizeClasses } from '@layerstack/tailwind';
  import { autoFocus, selectOnFocus } from '@layerstack/svelte-attachments';

  import Button from './Button.svelte';
  import Menu from './Menu.svelte';
  import MenuItem from './MenuItem.svelte';
  import ProgressCircle from './ProgressCircle.svelte';
  import TextField from './TextField.svelte';
  import { getComponentSettings, getSettings } from './settingsState.svelte.js';
  import { asIconData } from '../utils/icons.js';

  const settings = getSettings();
  const { classes: settingsClasses, defaults } = getComponentSettings('SelectField');

  let {
    options = [],
    name = '',
    label = '',
    placeholder = '',
    labelPlacement = defaults.labelPlacement,
    loading = false,
    required = false,
    disabled = false,
    readonly = false,
    icon,
    inlineOptions = false,
    toggleIcon,
    closeIcon,
    activeOptionIcon = false,
    clearable = true,
    base = false,
    rounded = false,
    dense = false,
    clearSearchOnOpen = true,
    autofocus,
    stepper = false,
    scrollIntoView = {},
    class: className,
    classes = {},
    placement = 'bottom-start',
    autoPlacement = true,
    matchWidth = true,
    resize = true,
    disableTransition = false,
    menuProps,
    value = $bindable(null),
    selected = $bindable(null),
    open = $bindable(false),
    search,
    onChange,
    onInputChange,
    prepend: prependSnippet,
    append: appendSnippet,
    beforeOptions,
    afterOptions,
    actions,
    option: optionSnippet,
    empty: emptySnippet,
    ...restProps
  }: SelectFieldProps<TValue> = $props();

  const icons = $derived(settings.icons);
  const resolvedToggleIcon = $derived(
    toggleIcon === undefined ? (!inlineOptions ? icons.chevronDown : null) : toggleIcon
  );
  const resolvedCloseIcon = $derived(closeIcon ?? icons.close);

  // `activeOptionIcon` swaps the field icon for the selected option's, falling back to the one
  // originally supplied — both are captured once, on purpose
  // svelte-ignore state_referenced_locally
  const originalIcon = icon;
  // svelte-ignore state_referenced_locally
  let activeIcon = $state<IconProp>(icon);

  const fieldClasses = $derived(
    typeof classes.field === 'string' ? { root: classes.field } : classes.field
  );

  let searchText = $state('');
  let filteredOptions = $state<MenuOption<TValue>[]>([]);
  let highlightIndex = $state(-1);

  // Elements
  let inputEl = $state<HTMLInputElement | HTMLTextAreaElement | null>(null);
  let menuOptionsEl = $state<HTMLDivElement | undefined>();
  let selectFieldEl = $state<HTMLDivElement | undefined>();

  function defaultSearch(text: string, opts: MenuOption<TValue>[]) {
    if (text === '' || opts.length === 0) return opts;

    const words = text?.toLowerCase().split(' ') ?? [];
    return opts.filter((option) => {
      const label = option.label.toLowerCase();
      return words.every((word) => label.includes(word));
    });
  }

  const searchFn = $derived(search ?? defaultSearch);

  const focusAttachment = $derived(
    autofocus
      ? (node: Element) => {
          const cleanupFocus = autoFocus(typeof autofocus === 'object' ? autofocus : undefined)(
            node as HTMLElement
          );
          const cleanupSelect = selectOnFocus()(node as HTMLInputElement);
          return () => {
            cleanupFocus?.();
            cleanupSelect?.();
          };
        }
      : () => {}
  );

  /* --- selection sync ------------------------------------------------------------------ */

  // Tracked outside the reactive graph so the sync below can tell which input actually changed
  let prevValue: TValue | null | undefined = undefined;
  let prevSelected: MenuOption<TValue> | null | undefined = undefined;

  function selectOption(option: MenuOption<TValue> | null, closeMenu = true) {
    const previousValue = value;
    const nextValue = option?.value ?? null;
    const nextText = option?.label ?? '';

    // Only write when something actually changes — the sync effect below reads `value`/`selected`,
    // so redundant assignments would re-trigger it indefinitely.  `selected` is compared by
    // `value` rather than by reference: it is a bindable prop, so what is read back is a `$state`
    // proxy of what was written, never the same object as the entry in `options`.
    if (value !== nextValue) value = nextValue;
    if (!isSameOption(selected, option)) selected = option;
    if (searchText !== nextText) searchText = nextText;

    if (activeOptionIcon) {
      activeIcon = option?.icon ? asIconData(option.icon) : originalIcon;
    }

    if (value !== previousValue) {
      onChange?.({ option, value });
    }

    if (closeMenu) {
      hide();
    }

    return option;
  }

  /** Compare options by `value` — see the note in `selectOption` about proxied bindable props */
  function isSameOption(a: MenuOption<TValue> | null | undefined, b: MenuOption<TValue> | null) {
    return a == null || b == null ? a == null && b == null : a.value === b.value;
  }

  function selectValue(next: TValue | null | undefined, closeMenu = true) {
    return selectOption(options?.find((option) => option.value === next) ?? null, closeMenu);
  }

  $effect(() => {
    // Track the three inputs; everything inside is read/written untracked
    const currentSelected = selected;
    const currentValue = value;
    const currentOptions = options;
    const isLoading = loading;

    untrack(() => {
      // Hold off while loading — the selected option may still be arriving
      if (isLoading) return;

      if (currentSelected !== undefined && currentSelected?.value !== prevSelected?.value) {
        prevValue = currentSelected?.value;
        // Do not close the menu when the selection is updated reactively
        prevSelected = selectOption(currentSelected, false);
      } else if (currentValue !== prevValue) {
        prevValue = currentValue;
        prevSelected = selectValue(currentValue, false);
      } else if (!open && prevValue !== undefined) {
        // Options may have changed, which can change the selected option's display text
        const resolved = options?.find((o) => o.value === prevValue) ?? null;
        if (!isSameOption(selected, resolved)) {
          selectOption(resolved, false);
        }
      }
      void currentOptions;
    });
  });

  /* --- filtering ----------------------------------------------------------------------- */

  let previousSearchText = '';

  $effect(() => {
    const isOpen = open;
    const text = searchText;
    const allOptions = options ?? [];

    if (!isOpen) return;

    untrack(() => {
      const prevHighlightedOption = filteredOptions[highlightIndex];

      if (text.trim() && previousSearchText !== text) {
        previousSearchText = text;
        Promise.resolve(searchFn(text, allOptions)).then((results) => {
          filteredOptions = results;

          const selectedIndex = results.findIndex((o) => o.value === value);
          if (highlightIndex === -1) {
            highlightIndex = selectedIndex === -1 ? nextOptionIndex(-1) : selectedIndex;
          } else {
            // Keep the previously highlighted option highlighted when it survives the filter
            const prevIndex = results.findIndex((o) => o === prevHighlightedOption);
            highlightIndex = prevIndex !== -1 ? prevIndex : nextOptionIndex(-1);
          }
        });
      } else if (text.trim() === '') {
        filteredOptions = allOptions;
      }
    });
  });

  $effect(() => {
    // Keep the unfiltered list in sync when options change and no search is active
    if (!searchText.trim()) {
      filteredOptions = options ?? [];
    }
  });

  $effect(() => {
    // Restore the field text when the menu closes without a new selection
    if (open === false && selected) {
      untrack(() => (searchText = selected!.label));
    }
  });

  /* --- keyboard navigation -------------------------------------------------------------- */

  function nextOptionIndex(currentIndex: number) {
    let nextIndex = filteredOptions.findIndex((o, i) => i > currentIndex && !o.disabled);
    if (nextIndex === -1) {
      // Wrap to the first non-disabled option
      nextIndex = filteredOptions.findIndex((o) => !o.disabled);
    }
    return nextIndex;
  }

  function prevOptionIndex(currentIndex: number) {
    let prevIndex = filteredOptions.findLastIndex((o, i) => i < currentIndex && !o.disabled);
    if (prevIndex === -1) {
      // Wrap to the last non-disabled option
      prevIndex = filteredOptions.findLastIndex((o) => !o.disabled);
    }
    return prevIndex;
  }

  function show() {
    if (disabled || readonly) return;

    if (open === false && clearSearchOnOpen) {
      searchText = ''; // show all options on open
    }
    open = true;
    inputEl?.focus();
  }

  function hide() {
    open = false;
    highlightIndex = -1;
  }

  function selectIndex(index: number) {
    const option = filteredOptions[index];
    // Ignore Enter when everything is filtered out
    return option ? selectOption(option) : undefined;
  }

  function onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowDown':
        if (open) highlightIndex = nextOptionIndex(highlightIndex);
        show();
        break;

      case 'ArrowUp':
        if (open) highlightIndex = prevOptionIndex(highlightIndex);
        show();
        break;

      case 'Escape':
        if (open) {
          inputEl?.focus();
          hide();
        }
        break;
    }
  }

  function onKeyPress(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      selectIndex(highlightIndex);
    }
  }

  function onBlur(e: FocusEvent) {
    const related = e.relatedTarget;

    // Keep open when focus moved into the menu, its scrollbar, or an auxiliary area
    if (
      related instanceof HTMLElement &&
      !related.closest('[role="dialog"]') &&
      // Safari resolves `relatedTarget` to `.options` rather than the clicked item
      !menuOptionsEl?.contains(related) &&
      related !== menuOptionsEl?.offsetParent &&
      !related.closest('.select-aux') &&
      !selectFieldEl?.contains(related) &&
      related !== selectFieldEl
    ) {
      hide();
    }
  }

  function previousValue() {
    const index = options.findIndex((o) => o.value === value);
    return index <= 0 ? options[options.length - 1].value : options[index - 1].value;
  }

  function nextValue() {
    const index = options.findIndex((o) => o.value === value);
    return index === options.length - 1 ? options[0].value : options[index + 1].value;
  }

  function clear() {
    // Clearing should not close the menu — keep it open if it already is
    selectOption(null, false);
    filteredOptions = options;
  }
</script>

{#snippet listOptions()}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    role="listbox"
    tabindex="-1"
    aria-expanded={open ? 'true' : 'false'}
    bind:this={menuOptionsEl}
    class={cls(
      'SelectFieldOptions options group p-1 focus:outline-hidden',
      settingsClasses.options,
      classes.options,
      inlineOptions && 'border-t mt-1 px-1'
    )}
    class:opacity-50={loading}
    onclick={(e) => {
      e.stopPropagation();
      if (!(e.target instanceof HTMLElement) || !menuOptionsEl) return;

      // Find the option wrapper the click landed in, falling back to the target itself.
      // `.options > *` handles a snippet that renders nested markup.
      const optionEl = e.target.closest('.options > *') ?? e.target;

      // Index among the options, ignoring group headers
      const optionIndex = [...menuOptionsEl.children]
        .filter((el) => !el.classList.contains('group-header'))
        .indexOf(optionEl);

      if (optionIndex !== -1) {
        selectIndex(optionIndex);
      }
    }}
    onkeydown={onKeyDown}
    onkeypress={onKeyPress}
  >
    {#each filteredOptions ?? [] as option, index (JSON.stringify(option))}
      {@const previousOption = filteredOptions[index - 1]}
      {#if option.group && option.group !== previousOption?.group}
        <div
          class={cls(
            'group-header text-xs leading-8 tracking-widest text-surface-content/50 px-2',
            settingsClasses.group,
            classes.group
          )}
        >
          {option.group}
        </div>
      {/if}

      {#if optionSnippet}
        {@render optionSnippet({ option, index, selected, value, highlightIndex })}
      {:else}
        <MenuItem
          icon={option.icon}
          class={cls(
            index === highlightIndex && '[:not(.group:hover)>&]:bg-surface-content/5',
            isSameOption(selected, option) && (classes.selected || 'font-semibold'),
            option.group ? 'px-4' : 'px-2',
            settingsClasses.option,
            classes.option
          )}
          scrollIntoView={{
            condition: index === highlightIndex,
            onlyIfNeeded: inlineOptions,
            ...scrollIntoView,
          }}
          role="option"
          aria-selected={isSameOption(selected, option) ? 'true' : 'false'}
          disabled={option.disabled}
        >
          {option.label}
        </MenuItem>
      {/if}
    {:else}
      {#if emptySnippet}
        {@render emptySnippet({ loading: loading ?? false })}
      {:else}
        <div
          class={cls(
            'p-3 text-surface-content/50 italic text-sm',
            settingsClasses.empty,
            classes.empty
          )}
        >
          {loading ? 'Loading...' : 'No options found'}
        </div>
      {/if}
    {/each}
  </div>
{/snippet}

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  bind:this={selectFieldEl}
  aria-haspopup={!inlineOptions ? 'listbox' : undefined}
  class={cls(
    'SelectField block w-full cursor-default text-left',
    settingsClasses.root,
    classes.root,
    className
  )}
  onclick={() => show()}
  tabindex="-1"
>
  <TextField
    {label}
    {labelPlacement}
    {placeholder}
    {base}
    {rounded}
    icon={activeIcon}
    {dense}
    {required}
    {disabled}
    bind:inputEl
    bind:value={() => searchText, (next) => (searchText = String(next ?? ''))}
    onChange={({ inputValue }) => {
      searchText = String(inputValue ?? '');
      onInputChange?.(searchText);
      show();
    }}
    onfocus={() => show()}
    onblur={onBlur}
    onkeydown={onKeyDown}
    onkeypress={onKeyPress}
    classes={clsMerge(
      {
        root: 'h-full',
        container: inlineOptions
          ? 'border-none shadow-none hover:shadow-none group-focus-within:shadow-none'
          : undefined,
      },
      normalizeClasses(settingsClasses.field),
      normalizeClasses(fieldClasses)
    )}
    role="combobox"
    aria-expanded={open ? 'true' : 'false'}
    aria-autocomplete={!inlineOptions ? 'list' : undefined}
    {@attach focusAttachment}
    {...restProps}
  >
    {#snippet prepend()}
      <span class="flex items-center">
        <input type="hidden" {name} value={value ?? ''} />

        {#if stepper}
          <Button
            icon={icons.chevronLeft}
            onclick={(e) => {
              e.stopPropagation();
              selectValue(previousValue());
            }}
            class="mr-2"
            size="sm"
          />
        {/if}
        {@render prependSnippet?.()}
      </span>
    {/snippet}

    {#snippet append()}
      <span class="flex items-center">
        {@render appendSnippet?.()}

        {#if loading}
          <span class="inline-block w-[29px] h-[28px] text-center">
            <ProgressCircle size={16} width={2} class="text-surface-content/50" />
          </span>
        {:else if readonly}
          <!-- no chevron or clear button -->
        {:else if value && clearable}
          <Button
            icon={resolvedCloseIcon}
            class="text-surface-content/50 p-1"
            onclick={(e) => {
              e.stopPropagation();
              clear();
            }}
          />
        {:else if resolvedToggleIcon}
          <Button
            icon={resolvedToggleIcon}
            class="text-surface-content/50 p-1 transform {open ? 'rotate-180' : ''}"
            tabindex={-1}
            onclick={(e) => {
              e.stopPropagation();
              open ? hide() : show();
            }}
          />
        {/if}

        {#if stepper}
          <Button
            icon={icons.chevronRight}
            onclick={(e) => {
              e.stopPropagation();
              selectValue(nextValue());
            }}
            class="mr-2"
            size="sm"
          />
        {/if}
      </span>
    {/snippet}
  </TextField>

  <!-- Improves the initial open display while options are still loading -->
  {#if options?.length > 0 || loading !== true}
    {#if inlineOptions}
      {@render listOptions()}
    {:else}
      <Menu
        {placement}
        {autoPlacement}
        {matchWidth}
        {resize}
        {disableTransition}
        moveFocus={false}
        bind:open
        onClose={() => hide()}
        {...menuProps}
      >
        <div class="select-aux">{@render beforeOptions?.({ hide })}</div>
        {@render listOptions()}
        <div class="select-aux">{@render afterOptions?.({ hide })}</div>
        <div class="select-aux">{@render actions?.({ hide })}</div>
      </Menu>
    {/if}
  {/if}
</div>
