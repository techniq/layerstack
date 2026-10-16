<script lang="ts" module>
  import type { DisabledDate } from '@layerstack/utils';

  import type { IconProp } from '../types/index.js';
  import type { FieldProps } from './Field.svelte';

  type DateFieldOwnProps = {
    name?: string;
    /** Bindable */
    value?: Date | null;
    /** Parsing/display format.  Defaults to the locale's base parsing format */
    format?: string;
    /** Input mask.  Defaults to a lowercased `format` */
    mask?: string;
    replace?: string;
    /** Show a calendar picker button */
    picker?: boolean;
    /**
     * Use UTC boundaries rather than local ones, for both parsing and display.
     *
     * Entering `08/12/2026` produces `2026-08-12T00:00:00.000Z` rather than local midnight.
     */
    utc?: boolean;
    /** Dates that cannot be selected in the picker */
    disabledDates?: DisabledDate;
    class?: string;
    classes?: {
      root?: string;
      field?: FieldProps['classes'];
    };
    label?: string;
    labelPlacement?: FieldProps['labelPlacement'];
    error?: string;
    hint?: string;
    required?: boolean;
    disabled?: boolean;
    clearable?: boolean;
    base?: boolean;
    rounded?: boolean;
    dense?: boolean;
    icon?: IconProp | null;
    /** Called when the parsed value changes */
    onChange?: (detail: { value: Date | null }) => void;
  };

  export type DateFieldProps = DateFieldOwnProps &
    Omit<FieldProps, keyof DateFieldOwnProps | 'children'>;
</script>

<script lang="ts">
  import { formatDate, parseDate } from '@layerstack/utils';
  import { localToUtcDate } from '@layerstack/utils/date';
  import { cls } from '@layerstack/tailwind';

  import DatePickerField from './DatePickerField.svelte';
  import Field from './Field.svelte';
  import Input from './Input.svelte';
  import { getComponentSettings, getSettings } from './settingsState.svelte.js';

  const settings = getSettings();
  const { classes: settingsClasses, defaults } = getComponentSettings('DateField');

  let {
    name = '',
    value = $bindable(null),
    format,
    mask,
    replace = 'dmyh',
    picker = false,
    utc = false,
    disabledDates,
    class: className,
    classes = {},
    label = '',
    labelPlacement = defaults.labelPlacement,
    error = '',
    hint = '',
    required = false,
    disabled = false,
    clearable = false,
    base = false,
    rounded = false,
    dense = false,
    icon = null,
    onChange,
    ...restProps
  }: DateFieldProps = $props();

  const actualFormat = $derived(
    format ?? settings.format.settings.formats.dates.baseParsing ?? 'MM/dd/yyyy'
  );
  const actualMask = $derived(mask ?? actualFormat.toLowerCase());

  let inputValue = $state<string>('');
</script>

<Field
  {...defaults}
  {...restProps}
  {label}
  {value}
  {icon}
  {error}
  {hint}
  {disabled}
  {base}
  {rounded}
  {dense}
  {clearable}
  {labelPlacement}
  onClear={() => {
    value = null;
    inputValue = '';
    onChange?.({ value });
  }}
  classes={classes.field}
  class={cls('DateField', settingsClasses.root, classes.root, className)}
>
  {#snippet children({ id })}
    <Input
      {required}
      {name}
      value={value ? formatDate(value, actualFormat, { utc }) : inputValue}
      mask={actualMask}
      {replace}
      {id}
      onChange={(next) => {
        inputValue = next;
        const lastValue = value;
        // `parseDate()` always builds a local date, so re-map the calendar fields onto UTC
        const parsed = parseDate(next ?? '', actualFormat);
        value = isNaN(parsed.valueOf()) ? null : utc ? localToUtcDate(parsed) : parsed;
        if (value !== lastValue) {
          onChange?.({ value });
        }
      }}
    />
  {/snippet}

  {#snippet append()}
    <span>
      {#if picker}
        <DatePickerField
          iconOnly
          {value}
          {utc}
          {disabledDates}
          onChange={(next) => {
            value = next;
            onChange?.({ value });
          }}
          class="p-1 text-surface-content/50"
        />
      {/if}
    </span>
  {/snippet}
</Field>
