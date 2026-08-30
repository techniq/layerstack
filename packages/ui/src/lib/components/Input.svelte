<script lang="ts" module>
  import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';

  type InputOwnProps = {
    name?: string;
    value?: string;
    type?: HTMLInputTypeAttribute;
    inputmode?: HTMLInputAttributes['inputmode'];
    id?: string;
    /** The underlying element.  Bindable */
    inputEl?: HTMLInputElement | null;
    autocapitalize?: HTMLInputAttributes['autocapitalize'];
    class?: string;

    /** Input mask (ex. `(___) ___-____`).  Also used as the placeholder while focused */
    mask?: string;
    /** Characters within `mask` that act as entry placeholders */
    replace?: string;
    /** Pattern of characters accepted into the mask */
    accept?: string | RegExp;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;

    /** see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min */
    min?: number;
    /** see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max */
    max?: number;
    /** see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step */
    step?: number;

    /**
     * Called with the masked value on every keystroke.  Distinct from the native `onchange`
     * attribute (still forwarded to the element), which fires on commit.
     */
    onChange?: (value: string) => void;
  };

  export type InputProps = InputOwnProps & Omit<HTMLInputAttributes, keyof InputOwnProps>;
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { cls } from '@layerstack/tailwind';

  import { getComponentClasses } from './theme.js';

  let {
    name = '',
    value = $bindable(''),
    type = 'text',
    inputmode,
    id,
    inputEl = $bindable(null),
    autocapitalize,
    class: className,
    mask = '',
    replace = '_',
    accept = '\\d',
    placeholder: placeholderProp,
    required = false,
    disabled = false,
    min,
    max,
    step,
    onChange,
    ...restProps
  }: InputProps = $props();

  const settingsClasses = getComponentClasses('Input');

  const placeholder = $derived(placeholderProp ?? mask);

  let isFocused = $state(false);
  let backspace = false;

  const replaceSet = $derived(new Set(replace)); // Set of characters to replace
  const prev = $derived(
    ((j) => Array.from(mask ?? '', (c, i) => (replaceSet.has(c) ? (j = i + 1) : j)))(0)
  );
  const firstPlaceholderPos = $derived([...(mask ?? '')].findIndex((c) => replaceSet.has(c)));
  const acceptRegEx = $derived(accept instanceof RegExp ? accept : new RegExp(accept, 'g'));

  function clean(inputValue: string) {
    // Get only accepted characters (no mask)
    const inputMatch = inputValue?.match(acceptRegEx) || [];

    if (inputMatch.length === 0) {
      return [];
    }

    // Apply mask to input
    return Array.from(mask, (maskChar) => {
      // If input character matches mask, or aligns with replacement placeholders
      if (inputMatch[0] === maskChar || replaceSet.has(maskChar)) {
        return inputMatch.shift() ?? maskChar;
      } else {
        return maskChar;
      }
    });
  }

  function applyMask(el: HTMLInputElement | HTMLTextAreaElement, mask: string) {
    if (mask) {
      // For selection (including just cursor position), ...
      const [i, j] = [el.selectionStart, el.selectionEnd].map((i) => {
        i = clean(el.value.slice(0, i ?? undefined)).findIndex((c) => replaceSet.has(c));
        return i < 0 ? prev[prev.length - 1] : backspace ? prev[i - 1] || firstPlaceholderPos : i;
      });
      value = clean(el.value).join('');
      el.value = value;
      el.setSelectionRange(i, j);
      backspace = false;
    } else {
      value = el.value;
    }
  }

  $effect(() => {
    if (inputEl) applyMask(inputEl, mask);
  });

  onMount(() => {
    // Format initially to handle partial values as well as different (but compatible) formats
    // (ex. phone numbers)
    if (mask) {
      const initialValue = value;
      value = clean(value).join('');
      if (value !== initialValue) {
        onChange?.(value);
      }
    }
  });
</script>

<input
  bind:this={inputEl}
  {id}
  {type}
  {name}
  {value}
  {min}
  {max}
  {step}
  {inputmode}
  placeholder={isFocused && mask ? mask : placeholder}
  {required}
  {disabled}
  {autocapitalize}
  {...restProps}
  class={cls(
    'Input',
    'text-sm w-full outline-hidden bg-transparent placeholder-surface/50 selection:bg-surface-content/10',
    mask && (mask == placeholder || isFocused || value) && 'font-mono',
    settingsClasses.root,
    className
  )}
  onkeydown={(e) => {
    backspace = e.key === 'Backspace';
    restProps.onkeydown?.(e);
  }}
  oninput={(e) => {
    applyMask(e.currentTarget, mask);
    onChange?.(value);
    restProps.oninput?.(e);
  }}
  onfocus={(e) => {
    isFocused = true;
    restProps.onfocus?.(e);
  }}
  onblur={(e) => {
    isFocused = false;
    // Reset the value if it still contains mask placeholders, to ensure complete entries
    if (mask && value) {
      const partialMaskMatch = [...value].some((char) => replaceSet.has(char));
      if (partialMaskMatch) {
        value = '';
        onChange?.(value);
      }
    }
    restProps.onblur?.(e);
  }}
/>

<style>
  /* Hide +/- buttons */
  input[type='number'] {
    appearance: textfield;
    -moz-appearance: textfield;
  }
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
</style>
