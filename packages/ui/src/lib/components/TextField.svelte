<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type {
    AriaRole,
    HTMLAttributes,
    HTMLInputAttributes,
    FocusEventHandler,
    KeyboardEventHandler,
    MouseEventHandler,
  } from 'svelte/elements';

  import type { IconProp, LabelPlacement } from '../types/index.js';
  import type { InputProps } from './Input.svelte';

  export type TextFieldInputValue = string | number;
  export type TextFieldValue =
    | TextFieldInputValue
    | { [operator: string]: TextFieldInputValue | null }
    | null;

  export type TextFieldChangeDetail = {
    value: TextFieldValue;
    inputValue: TextFieldInputValue | null;
    operator?: string;
  };

  type TextFieldElement = HTMLInputElement | HTMLTextAreaElement;

  type TextFieldOwnProps = {
    name?: string;
    label?: string;
    labelPlacement?: LabelPlacement;
    /** Bindable.  An object when `operators` are used (ex. `{ gt: 5 }`) */
    value?: TextFieldValue;
    type?:
      | 'text'
      | 'password'
      | 'integer'
      | 'decimal'
      | 'currency'
      | 'percent'
      | 'search'
      | 'email';
    placeholder?: string;
    error?: string | string[] | boolean;
    hint?: string;
    autocomplete?: HTMLInputAttributes['autocomplete'];
    /** Render a `<textarea>` instead of an `<input>` */
    multiline?: boolean;
    required?: boolean;
    disabled?: boolean;
    /** Show a button to clear the value when one is set */
    clearable?: boolean;
    /** Remove the background and rounding, leaving only layout */
    base?: boolean;
    rounded?: boolean;
    /** Reduce vertical padding */
    dense?: boolean;
    icon?: IconProp;
    iconRight?: IconProp;
    align?: 'left' | 'center' | 'right';
    /** Focus the input on mount.  Pass an object to configure the `autoFocus` attachment */
    autofocus?: boolean | Parameters<typeof autoFocus>[0];
    /** Comparison operators offered alongside the value (ex. `[{ label: '>', value: 'gt' }]`) */
    operators?: { label: string; value: string }[];
    /** The underlying `<input>`/`<textarea>`.  Bindable */
    inputEl?: TextFieldElement | null;
    /** Debounce `onChange` by `300ms`, or the given number of milliseconds */
    debounceChange?: boolean | number;
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

    // Input props
    mask?: string;
    replace?: string;
    accept?: string | RegExp;
    /** https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize */
    autocapitalize?: InputProps['autocapitalize'];
    role?: AriaRole;

    /** see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min */
    min?: number;
    /** see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max */
    max?: number;
    /** see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step */
    step?: number;

    /** Called when the value changes.  Custom callbacks are camelCased; native handlers are not */
    onChange?: (detail: TextFieldChangeDetail) => void;
    /** Called when the clear button is pressed */
    onClear?: () => void;
    /** Called when the input area is clicked */
    onclick?: MouseEventHandler<HTMLDivElement>;

    onfocus?: FocusEventHandler<TextFieldElement>;
    onblur?: FocusEventHandler<TextFieldElement>;
    onkeydown?: KeyboardEventHandler<TextFieldElement>;
    onkeypress?: KeyboardEventHandler<TextFieldElement>;

    prepend?: Snippet;
    append?: Snippet;
    prefix?: Snippet;
    suffix?: Snippet;
  };

  export type TextFieldProps = TextFieldOwnProps &
    Omit<HTMLAttributes<HTMLLabelElement>, keyof TextFieldOwnProps>;
</script>

<script lang="ts">
  import { untrack } from 'svelte';
  import { cls } from '@layerstack/tailwind';
  import { isLiteralObject } from '@layerstack/utils/object';
  import { uniqueId } from '@layerstack/utils';
  import { autoFocus } from '@layerstack/svelte-attachments';

  import { DEFAULT_LABEL_PLACEMENT } from '../types/index.js';
  import { getComponentSettings, getSettings } from './settingsState.svelte.js';
  import { asIconData } from '../utils/icons.js';
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';
  import Input from './Input.svelte';

  const settings = getSettings();
  const { classes: settingsClasses, defaults } = getComponentSettings('TextField');
  const { defaults: fieldDefaults } = getComponentSettings('Field');

  let {
    name,
    label = '',
    labelPlacement = defaults.labelPlacement ??
      fieldDefaults.labelPlacement ??
      DEFAULT_LABEL_PLACEMENT,
    value = $bindable(''),
    type = 'text',
    placeholder,
    error = '',
    hint = '',
    autocomplete = 'off',
    multiline = false,
    required = false,
    disabled = false,
    clearable = false,
    base = false,
    rounded = false,
    dense = false,
    icon = null,
    iconRight = null,
    align = 'left',
    autofocus = false,
    operators,
    inputEl = $bindable(null),
    debounceChange = false,
    id = uniqueId('textfield-'),
    class: className,
    classes = {},
    mask,
    replace,
    accept,
    autocapitalize,
    role,
    min,
    max,
    step,
    onChange,
    onClear,
    onclick,
    onfocus,
    onblur,
    onkeydown,
    onkeypress,
    prepend,
    append,
    prefix,
    suffix,
    ...restProps
  }: TextFieldProps = $props();

  const icons = $derived(settings.icons);

  const resolvedStep = $derived(step ?? (type === 'decimal' ? 0.1 : 1));

  // The password reveal button flips the rendered type without changing `type`
  let passwordRevealed = $state(false);

  const inputType = $derived.by(() => {
    switch (type) {
      case 'integer':
      case 'decimal':
      case 'currency':
      case 'percent':
        // TODO: typing '.' on iOS appears to clear the input when using type="number"
        return 'number';
      case 'password':
        return passwordRevealed ? 'text' : 'password';
      case 'email':
        return 'email';
      case 'search':
        return 'search';
      case 'text':
      default:
        return 'text';
    }
  });

  const inputMode = $derived.by((): HTMLInputAttributes['inputmode'] => {
    switch (type) {
      case 'integer':
        return 'numeric';
      case 'decimal':
      case 'currency':
      case 'percent':
        return 'decimal';
      case 'email':
        return 'email';
      case 'search':
        return 'search';
      case 'text':
      case 'password':
      default:
        return 'text';
    }
  });

  let inputValue = $state<TextFieldInputValue | null>(value == null ? '' : String(value));

  const potentialInputValue = $derived(
    isLiteralObject(value) ? Object.values(value)[0] : (value ?? null)
  );

  $effect(() => {
    const next = potentialInputValue;
    const isNumber = inputType === 'number';
    // `inputValue` is read untracked so this effect does not re-trigger on its own write
    untrack(() => {
      // Update `inputValue`, but for number inputs only when the values actually differ.  This
      // avoids the cursor jumping while backspacing around a decimal point, since e.g. "123" and
      // "123." are both 123.
      if (!isNumber || inputValue != next) {
        inputValue = next;
      }
    });
  });

  // The select overrides the operator derived from `value`
  let operatorOverride = $state<string>();
  const operator = $derived(
    operatorOverride ?? (isLiteralObject(value) ? Object.keys(value)[0] : operators?.[0]?.value)
  );

  let lastTimeoutId: ReturnType<typeof setTimeout>;

  function updateValue() {
    const valueAsType = inputType === 'number' ? Number(inputValue) : inputValue;

    // Wrap with the operator when one is in use
    value =
      inputValue && operator ? { [operator]: valueAsType } : inputValue === '' ? null : valueAsType;

    const detail = { value, inputValue, operator };
    if (debounceChange) {
      clearTimeout(lastTimeoutId);
      lastTimeoutId = setTimeout(
        () => onChange?.(detail),
        debounceChange === true ? 300 : debounceChange
      );
    } else {
      onChange?.(detail);
    }
  }

  function handleInput(e: Event) {
    const el = e.target as TextFieldElement;
    if (accept) {
      // filter input based on accepted characters
      const regex = new RegExp(accept, 'g');
      inputValue = el.value.match(regex)?.[0] ?? '';
      el.value = String(inputValue);
    } else {
      inputValue = el.value;
    }
    updateValue();
  }

  const focusAttachment = $derived(
    autofocus ? autoFocus(typeof autofocus === 'object' ? autofocus : undefined) : () => {}
  );

  const hasInputValue = $derived(inputValue != null && inputValue !== '');
  const hasInsetLabel = $derived(['inset', 'float'].includes(labelPlacement) && label !== '');

  const hasPrepend = $derived(prepend !== undefined || !!icon);
  const hasAppend = $derived(
    append !== undefined ||
      iconRight != null ||
      clearable ||
      Boolean(error) ||
      operators !== undefined ||
      type === 'password'
  );
  const hasPrefix = $derived(prefix !== undefined || type === 'currency');
  const hasSuffix = $derived(suffix !== undefined || type === 'percent');

  const inputClass = $derived(
    cls(
      'text-sm border-none w-full bg-transparent outline-hidden',
      'placeholder-surface-content/0 group-focus-within:placeholder-surface-content/50',
      error && 'placeholder-danger',
      (labelPlacement !== 'float' || !hasInsetLabel) && 'placeholder-surface-content/50',
      {
        'text-left': align === 'left',
        'text-center': align === 'center',
        'text-right': align === 'right',
      },
      settingsClasses.input,
      classes.input
    )
  );

  let labelEl: HTMLLabelElement | null = $state(null);

  // `Input` only ever renders an `<input>`, while `inputEl` here also covers the `<textarea>`
  // branch — a function binding bridges the two types
  const getInputEl = () => inputEl as HTMLInputElement | null;
  const setInputEl = (el: HTMLInputElement | null) => (inputEl = el);
</script>

<label
  for={id}
  role="group"
  bind:this={labelEl}
  {...restProps}
  class={cls(
    'TextField',
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
        'truncate group-hover:text-surface-content/70 group-focus-within:text-[var(--color)] group-focus-within:group-hover:text-(--color) cursor-pointer',
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
        'group-focus-within:shadow-md group-focus-within:border-[var(--color)]!',
        settingsClasses.container,
        classes.container
      )}
    >
      <div class="flex items-center">
        {#if hasPrepend}
          <div
            class={cls(
              'prepend flex items-center whitespace-nowrap',
              rounded && 'pl-3',
              settingsClasses.prepend,
              classes.prepend
            )}
          >
            {@render prepend?.()}
            {#if icon}
              <span class="mr-3">
                <Icon data={asIconData(icon)} class="text-surface-content/50" />
              </span>
            {/if}
          </div>
        {/if}

        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div role={role === 'combobox' ? role : undefined} class="grow inline-grid" {onclick}>
          {#if label && ['inset', 'float'].includes(labelPlacement)}
            <span
              class={cls(
                'label',
                'col-span-full row-span-full z-1 flex items-center h-full truncate origin-top-left transition-all duration-200 group-hover:text-surface-content/70 group-focus-within:text-[var(--color)] group-focus-within:group-hover:text-(--color) cursor-pointer',
                error ? 'text-danger/80' : 'text-surface-content/50',
                `placement-${labelPlacement}`,
                (labelPlacement === 'inset' || hasInputValue) && 'shrink',
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
              (hasPrefix || hasSuffix) &&
                label &&
                labelPlacement === 'float' &&
                !hasInputValue &&
                'opacity-0 transition-opacity',
              'group-focus-within:opacity-100'
            )}
          >
            {@render prefix?.()}

            {#if type === 'currency'}
              <Icon data={icons.currency} class="size-4 text-surface-content/50 -mt-1" />
            {/if}

            {#if multiline}
              <textarea
                {id}
                {name}
                {placeholder}
                {autocomplete}
                {required}
                {disabled}
                value={inputValue}
                {autocapitalize}
                bind:this={inputEl}
                oninput={handleInput}
                {onfocus}
                {onblur}
                {onkeydown}
                {onkeypress}
                class={cls(inputClass, 'resize-none')}
                {@attach focusAttachment}
              ></textarea>
            {:else}
              <Input
                {id}
                {name}
                {placeholder}
                {required}
                {disabled}
                {autocomplete}
                type={inputType}
                inputmode={inputMode}
                value={String(inputValue ?? '')}
                {mask}
                {replace}
                {accept}
                {autocapitalize}
                {min}
                {max}
                step={resolvedStep}
                bind:inputEl={getInputEl, setInputEl}
                oninput={handleInput}
                {onfocus}
                {onblur}
                {onkeydown}
                {onkeypress}
                class={cls(inputClass, 'truncate selection:bg-surface-content/30')}
                {@attach focusAttachment}
              />
            {/if}

            {#if type === 'percent'}
              <Icon data={icons.percent} class="size-4 text-surface-content/50 -mt-1 ml-1" />
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
            {#if clearable && hasInputValue}
              <Button
                icon={icons.close}
                {disabled}
                class="text-surface-content/50 p-1"
                onclick={() => {
                  inputValue = '';
                  operatorOverride = operators?.[0]?.value;
                  updateValue();
                  onClear?.();
                  labelEl?.focus();
                }}
              />
            {/if}

            {#if operators}
              <select
                {disabled}
                value={operator}
                onchange={(e) => {
                  operatorOverride = e.currentTarget.value;
                  updateValue();
                }}
                class="appearance-none bg-surface-content/5 border rounded-full mr-2 px-2 text-sm outline-hidden focus:border-opacity-50 focus:shadow-md"
                style="text-align-last: center;"
              >
                {#each operators as { label: operatorLabel, value: operatorValue } (operatorValue)}
                  <option value={operatorValue}>{operatorLabel}</option>
                {/each}
              </select>
            {/if}

            {#if type === 'password'}
              <Button
                icon={icons.reveal}
                {disabled}
                class="text-surface-content/50 p-2"
                onclick={() => (passwordRevealed = !passwordRevealed)}
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
</label>

<style>
  .TextField:focus-within .label.placement-float,
  .label.shrink {
    transform: scale(0.75);
    width: 133%; /* offset 75% scale */
    height: 32px;
  }

  :global(input::placeholder),
  textarea::placeholder {
    transition: color 200ms;
  }
</style>
