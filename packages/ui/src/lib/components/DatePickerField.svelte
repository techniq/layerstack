<script lang="ts" module>
  import { PeriodType, type DisabledDate } from '@layerstack/utils';

  import type { IconProp } from '../types/index.js';
  import type { FieldProps } from './Field.svelte';

  type DatePickerFieldOwnProps = {
    name?: string;
    /** Bindable */
    value?: Date | null;
    periodType?: PeriodType;
    /** Render only a calendar icon button */
    iconOnly?: boolean;
    /** Show previous/next period buttons */
    stepper?: boolean;
    /** Use UTC boundaries rather than local ones, for both period math and display */
    utc?: boolean;
    label?: string | null;
    labelPlacement?: FieldProps['labelPlacement'];
    error?: string;
    hint?: string;
    disabled?: boolean;
    clearable?: boolean;
    base?: boolean;
    rounded?: boolean;
    dense?: boolean;
    icon?: IconProp;
    center?: boolean;
    /** Dates that cannot be selected */
    disabledDates?: DisabledDate;
    /** Called when the value is committed */
    onChange?: (value: Date | null) => void;
    /** Called when the clear button is pressed */
    onClear?: () => void;
  };

  export type DatePickerFieldProps = DatePickerFieldOwnProps &
    Omit<FieldProps, keyof DatePickerFieldOwnProps | 'children'>;
</script>

<script lang="ts">
  import { slide } from 'svelte/transition';
  import { DateToken, getDateFuncsByPeriodType } from '@layerstack/utils';

  import Button from './Button.svelte';
  import DateSelect from './DateSelect.svelte';
  import Dialog from './Dialog.svelte';
  import Field from './Field.svelte';
  import { getComponentSettings, getSettings } from './settingsState.svelte.js';

  const { defaults } = getComponentSettings('DatePickerField');
  const settings = getSettings();

  let {
    name = '',
    value = $bindable(null),
    periodType = PeriodType.Day,
    iconOnly = false,
    stepper = false,
    utc = false,
    label = null,
    labelPlacement = defaults.labelPlacement,
    error = '',
    hint = '',
    disabled = false,
    clearable = false,
    base = false,
    rounded = false,
    dense = false,
    icon,
    center = false,
    disabledDates,
    onChange,
    onClear,
    ...restProps
  }: DatePickerFieldProps = $props();

  const icons = $derived(settings.icons);
  const dictionary = $derived(settings.format.settings.dictionary);

  let open = $state(false);
  /** The in-dialog selection, committed to `value` on OK */
  let currentValue = $state<Date | null>(null);

  $effect(() => {
    currentValue = value;
  });

  // Show "Day of Week", "Year", etc. depending on the period type
  const primaryFormat = $derived(
    periodType === PeriodType.Month
      ? DateToken.Month_long
      : [DateToken.Month_long, DateToken.DayOfMonth_withOrdinal, DateToken.Year_numeric]
  );
  const secondaryFormat = $derived(
    periodType === PeriodType.Month ? DateToken.Year_numeric : DateToken.DayOfWeek_long
  );

  function step(direction: 1 | -1) {
    if (!value || !periodType) return;
    const { add } = getDateFuncsByPeriodType(settings.localeSettings, periodType, { utc });
    value = add(value, direction);
    onChange?.(value);
  }
</script>

{#if iconOnly}
  <!-- The rest props are typed against `Field`; in icon-only mode they land on a `Button` instead -->
  <Button icon={icons.calendar} onclick={() => (open = true)} {...restProps as any} />
{:else}
  <Field
    label={label ?? settings.format(value, PeriodType.Day, { custom: secondaryFormat, utc })}
    {labelPlacement}
    {icon}
    {error}
    {hint}
    {disabled}
    {base}
    {rounded}
    {dense}
    {center}
    {...restProps}
  >
    {#snippet prepend()}
      <span>
        <input type="hidden" {name} value={value?.toISOString() ?? ''} />

        {#if stepper}
          <Button icon={icons.chevronLeft} class="p-2" onclick={() => step(-1)} />
        {/if}
      </span>
    {/snippet}

    {#snippet children({ id })}
      <button
        type="button"
        class="text-sm min-h-[1.25rem] whitespace-nowrap w-full focus:outline-hidden"
        style="text-align: inherit"
        onclick={() => (open = true)}
        {id}
      >
        {settings.format(value, PeriodType.Day, { custom: primaryFormat, utc })}
      </button>
    {/snippet}

    {#snippet append()}
      <div>
        {#if clearable && value}
          <Button
            icon={icons.close}
            class="text-surface-content/50 p-1"
            onclick={() => {
              value = null;
              onClear?.();
              onChange?.(value);
            }}
          />
        {/if}

        {#if stepper}
          <Button icon={icons.chevronRight} class="p-2" onclick={() => step(1)} />
        {/if}
      </div>
    {/snippet}
  </Field>
{/if}

<Dialog bind:open>
  {#if currentValue}
    <div
      class="flex flex-col justify-center bg-primary text-primary-content px-6 h-24"
      transition:slide
    >
      <div class="text-sm opacity-50">
        {settings.format(currentValue, PeriodType.Day, { custom: secondaryFormat, utc })}
      </div>
      <div class="text-3xl">
        {settings.format(currentValue, PeriodType.Day, { custom: primaryFormat, utc })}
      </div>
    </div>
  {/if}

  <div class="p-2 w-96">
    <DateSelect
      selected={currentValue}
      {periodType}
      {disabledDates}
      {utc}
      onDateChange={(date) => (currentValue = date)}
    />
  </div>

  {#snippet actions()}
    <div class="flex items-center gap-2">
      <Button
        icon={icons.check}
        onclick={() => {
          open = false;
          value = currentValue;
          onChange?.(value);
        }}
        variant="fill"
        color="primary"
      >
        {dictionary.Ok}
      </Button>
      <Button
        onclick={() => {
          open = false;
          currentValue = value;
        }}
      >
        {dictionary.Cancel}
      </Button>
    </div>
  {/snippet}
</Dialog>
