<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import { PeriodType, type DisabledDate } from '@layerstack/utils';
  import {
    getDateRangePresets,
    type DateRange as DateRangeType,
  } from '@layerstack/utils/dateRange';

  import type { IconProp } from '../types/index.js';
  import type { DialogProps } from './Dialog.svelte';
  import type { FieldProps } from './Field.svelte';

  export const emptyDateRange: DateRangeType = { from: null, to: null, periodType: null };

  type DateRangeFieldOwnProps = {
    /** Bindable */
    value?: DateRangeType;
    /** Show previous/next buttons that shift by the current range length */
    stepper?: boolean;
    center?: boolean;
    periodTypes?: PeriodType[];
    getPeriodTypePresets?: typeof getDateRangePresets;
    /**
     * Use UTC boundaries rather than local ones, for both period math and display.
     *
     * Use for values keyed on a UTC calendar date (ex. partition/`ds` ranges), so the field is
     * unaffected by the viewer's timezone or by DST.
     */
    utc?: boolean;
    /** Shown in a menu before opening the full picker */
    quickPresets?: { label: string; value: DateRangeType }[];
    /** Dates that cannot be selected */
    disabledDates?: DisabledDate;
    classes?: {
      field?: FieldProps['classes'];
      dialog?: DialogProps['classes'];
    };
    label?: string | null;
    error?: string;
    hint?: string;
    disabled?: boolean;
    clearable?: boolean;
    base?: boolean;
    rounded?: boolean;
    dense?: boolean;
    icon?: IconProp | null;
    /** Called when the range is committed */
    onChange?: (value: DateRangeType) => void;
    /** Called when the clear button is pressed */
    onClear?: () => void;
    prepend?: Snippet;
    append?: Snippet;
  };

  export type DateRangeFieldProps = DateRangeFieldOwnProps &
    Omit<FieldProps, keyof DateRangeFieldOwnProps | 'children' | 'classes'>;
</script>

<script lang="ts">
  import { getDateFuncsByPeriodType } from '@layerstack/utils';
  import { cls } from '@layerstack/tailwind';

  import Button from './Button.svelte';
  import DateRange from './DateRange.svelte';
  import DateRangeDisplay from './DateRangeDisplay.svelte';
  import Dialog from './Dialog.svelte';
  import Field from './Field.svelte';
  import Menu from './Menu.svelte';
  import MenuItem from './MenuItem.svelte';
  import { getComponentSettings, getSettings } from './settingsState.svelte.js';

  const settings = getSettings();
  const { defaults } = getComponentSettings('DateRangeField');

  let {
    value = $bindable(emptyDateRange),
    stepper = false,
    center = false,
    periodTypes = [
      PeriodType.Day,
      PeriodType.Week,
      PeriodType.BiWeek1,
      PeriodType.Month,
      PeriodType.Quarter,
      PeriodType.CalendarYear,
      PeriodType.FiscalYearOctober,
    ],
    getPeriodTypePresets = getDateRangePresets,
    utc = false,
    quickPresets = [],
    disabledDates,
    classes = {},
    label = null,
    error = '',
    hint = '',
    disabled = false,
    clearable = false,
    base = false,
    rounded = false,
    dense = false,
    icon = null,
    onChange,
    onClear,
    prepend: prependSnippet,
    append: appendSnippet,
    ...restProps
  }: DateRangeFieldProps = $props();

  const icons = $derived(settings.icons);
  const dictionary = $derived(settings.localeSettings.dictionary);

  let showDialog = $state(false);
  let showQuickPresetsMenu = $state(false);

  /** The dialog's pending range, committed to `value` on OK */
  let currentValue = $state<DateRangeType>(value);

  $effect(() => {
    currentValue = value;
  });

  /** Shift the range by its own length, in either direction */
  function shift(direction: 1 | -1) {
    if (!value?.from || !value?.to || !value?.periodType) return;

    const { difference, start, end, add } = getDateFuncsByPeriodType(
      settings.localeSettings,
      value.periodType,
      { utc }
    );
    const periodCount = difference(value.from, value.to) + 1;
    const from = start(add(value.from, periodCount * direction));

    value = {
      from,
      to: end(add(from, periodCount - 1)),
      periodType: value.periodType,
    };
    onChange?.(value);
  }
</script>

<Field
  label={label ?? (value.periodType ? settings.format.getPeriodTypeName(value.periodType) : '')}
  {icon}
  {error}
  {hint}
  {disabled}
  {base}
  {rounded}
  {dense}
  {center}
  classes={classes.field}
  {...defaults}
  {...restProps}
>
  {#snippet prepend()}
    <span class="flex items-center">
      {@render prependSnippet?.()}

      {#if stepper}
        <Button icon={icons.chevronLeft} class="p-2" onclick={() => shift(-1)} />
      {/if}
    </span>
  {/snippet}

  {#snippet children({ id })}
    <button
      type="button"
      class={cls(
        'text-sm whitespace-nowrap w-full focus:outline-hidden',
        center ? 'text-center' : 'text-left'
      )}
      onclick={() => {
        if (quickPresets.length > 0) {
          showQuickPresetsMenu = !showQuickPresetsMenu;
        } else {
          showDialog = true;
        }
      }}
      {id}
    >
      <DateRangeDisplay {value} {utc} />
    </button>
  {/snippet}

  {#snippet append()}
    <div class="flex items-center">
      {#if clearable && (value?.periodType || value?.from || value?.to)}
        <Button
          icon={icons.close}
          class="text-surface-content/50 p-1"
          onclick={() => {
            value = emptyDateRange;
            onClear?.();
            onChange?.(value);
          }}
        />
      {/if}

      {@render appendSnippet?.()}

      {#if stepper}
        <Button icon={icons.chevronRight} class="p-2" onclick={() => shift(1)} />
      {/if}
    </div>
  {/snippet}

  {#snippet root()}
    <Menu classes={{ menu: 'p-1' }} bind:open={showQuickPresetsMenu} matchWidth>
      {#each quickPresets as preset (preset.label)}
        <MenuItem
          onclick={() => {
            value = preset.value;
            onChange?.(preset.value);
          }}
        >
          {preset.label}
        </MenuItem>
      {/each}

      <div class="h-px bg-surface-content/20 my-1"></div>

      <MenuItem onclick={() => (showDialog = true)}>Custom...</MenuItem>
    </Menu>
  {/snippet}
</Field>

<Dialog
  bind:open={showDialog}
  classes={{
    ...classes.dialog,
    dialog: cls('max-h-[90vh] grid grid-rows-[auto_1fr_auto]', classes.dialog?.dialog),
  }}
>
  <div class="flex flex-col justify-center bg-primary text-primary-content px-6 h-24">
    <div class="text-sm opacity-50">
      {currentValue.periodType
        ? settings.format.getPeriodTypeName(currentValue.periodType)
        : ''}&nbsp;
    </div>
    <div class="text-xl sm:text-2xl">
      <DateRangeDisplay value={currentValue} {utc} />
    </div>
  </div>

  <div class="p-2 border-b overflow-auto">
    <DateRange
      bind:selected={currentValue}
      {periodTypes}
      {getPeriodTypePresets}
      {disabledDates}
      {utc}
      class="h-full"
    />
  </div>

  {#snippet actions()}
    <div class="flex items-center gap-2">
      <Button
        icon={icons.check}
        onclick={() => {
          showDialog = false;
          value = currentValue;
          onChange?.(value);
        }}
        color="primary"
        variant="fill"
      >
        {dictionary.Ok}
      </Button>

      <Button
        onclick={() => {
          showDialog = false;
          currentValue = value;
        }}
      >
        {dictionary.Cancel}
      </Button>
    </div>
  {/snippet}
</Dialog>
