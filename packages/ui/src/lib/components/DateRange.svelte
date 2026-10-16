<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements';
  import { PeriodType, type DisabledDate } from '@layerstack/utils';
  // Aliased: `DateRange` is also this component's name, and the generated `.d.ts`
  // declares both in the same scope
  import {
    getDateRangePresets,
    type DateRange as DateRangeValue,
  } from '@layerstack/utils/dateRange';

  type DateRangeOwnProps = {
    /** Bindable */
    selected?: DateRangeValue | null;
    class?: string;
    /** Period types offered in the sidebar */
    periodTypes?: PeriodType[];
    getPeriodTypePresets?: typeof getDateRangePresets;
    /** Use UTC boundaries rather than local ones, for both period math and display */
    utc?: boolean;
    /** Dates that cannot be selected */
    disabledDates?: DisabledDate;
  };

  export type DateRangeProps = DateRangeOwnProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof DateRangeOwnProps>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';
  import { omit } from '@layerstack/utils/object';
  import { MediaQueryPresets } from '@layerstack/svelte-state';
  import {
    DayOfWeek,
    getDateFuncsByPeriodType,
    isDateAfter,
    isDateBefore,
    isSameInterval,
  } from '@layerstack/utils';
  import { hasDayOfWeek, replaceDayOfWeek, missingDayOfWeek } from '@layerstack/utils/date';

  import DateSelect from './DateSelect.svelte';
  import MenuField from './MenuField.svelte';
  import ToggleGroup from './ToggleGroup.svelte';
  import ToggleOption from './ToggleOption.svelte';
  import { getComponentClasses } from './theme.js';
  import { getSettings } from './settingsState.svelte.js';

  let {
    selected = $bindable({ from: null, to: null, periodType: null }),
    class: className,
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
    disabledDates,
    ...restProps
  }: DateRangeProps = $props();

  const settingsClasses = getComponentClasses('DateRange');
  const settings = getSettings();
  const media = new MediaQueryPresets();

  const dayInterval = $derived(utc ? ('utcDay' as const) : ('day' as const));

  // svelte-ignore state_referenced_locally
  let selectedPeriodType = $state(selected?.periodType ?? periodTypes[0]);
  let selectedPreset = $state<string | null>(null);
  // Seeded from the locale, then owned by the picker
  // svelte-ignore state_referenced_locally
  let selectedDayOfWeek = $state<DayOfWeek>(
    settings.format.settings.formats.dates.weekStartsOn ?? DayOfWeek.Sunday
  );
  let activeDate = $state<'from' | 'to'>('from');

  /** Adjust a period type for the currently selected start-of-week */
  function adjustPeriodType(periodType: PeriodType) {
    return missingDayOfWeek(periodType)
      ? (replaceDayOfWeek(periodType, selectedDayOfWeek) ?? periodType)
      : periodType;
  }

  const periodTypeOptions = $derived(
    periodTypes.map((pt) => {
      const value = adjustPeriodType(pt);
      return { label: settings.format.getPeriodTypeName(value), value };
    })
  );

  /** The date range, without its period type, as a comparable string */
  function getDateRangeStr(range: DateRangeValue) {
    return JSON.stringify(omit(range, ['periodType']));
  }

  const presetOptions = $derived(
    getPeriodTypePresets(settings.localeSettings, selectedPeriodType, { utc }).map((preset) => ({
      label: preset.label,
      value: getDateRangeStr(preset.value),
      preset,
    }))
  );

  function onDateChange(date: Date) {
    const newSelected = { ...selected, periodType: selectedPeriodType };
    const { start, end } = getDateFuncsByPeriodType(settings.localeSettings, selectedPeriodType, {
      utc,
    });

    let newActiveDate: typeof activeDate = activeDate === 'from' ? 'to' : 'from';

    if (activeDate === 'from') {
      newSelected.from = start(date);
      if (selected?.to != null && isDateAfter(date, selected.to)) {
        newSelected.to = end(date);
      }
    } else {
      newSelected.to = end(date);
      if (selected?.from != null && isDateBefore(date, selected.from)) {
        newSelected.from = start(date);
        newActiveDate = 'to';
      }
    }

    selected = newSelected as DateRangeValue;
    activeDate = newActiveDate;
  }

  /** Expand the selection to match a new period type (day => month, etc) */
  function onPeriodTypeChange(periodType: PeriodType) {
    const { start, end } = getDateFuncsByPeriodType(settings.localeSettings, periodType, { utc });
    if (!selected) return;

    selected = {
      ...selected,
      from: selected.from ? start(selected.from) : selected.from,
      to: selected.to ? end(selected.to) : selected.to,
      periodType: selected.periodType ? periodType : selected.periodType,
    } as DateRangeValue;
  }

  function onPresetChange(presetValueString: string | null) {
    const preset = presetOptions.find((o) => o.value === presetValueString)?.preset;
    if (preset) {
      selected = preset.value;
    }
  }

  // Re-derive the selection after the start-of-week changes, keeping the equivalent preset.
  // Seeded with the current value so the effect does not fire on mount.
  // svelte-ignore state_referenced_locally
  let lastDayOfWeek = selectedDayOfWeek;
  $effect(() => {
    if (selectedDayOfWeek === lastDayOfWeek) return;
    lastDayOfWeek = selectedDayOfWeek;

    if (!hasDayOfWeek(selectedPeriodType)) return;

    const newPeriodType = replaceDayOfWeek(selectedPeriodType, selectedDayOfWeek);
    const newSelected = { ...selected, periodType: newPeriodType };

    if (selected?.from && selected?.to && selected.periodType) {
      const prevPreset = [
        ...getPeriodTypePresets(settings.localeSettings, selected.periodType, { utc }),
      ].find(
        (x) =>
          x.value.from &&
          isSameInterval(dayInterval, x.value.from, selected!.from!) &&
          x.value.to &&
          isSameInterval(dayInterval, x.value.to, selected!.to!)
      );

      if (prevPreset && newPeriodType) {
        const newPreset = [
          ...getPeriodTypePresets(settings.localeSettings, newPeriodType, { utc }),
        ].find((x) => x.label === prevPreset.label);

        if (newPreset) {
          newSelected.from = newPreset.value.from;
          newSelected.to = newPreset.value.to;
        }
      }
    }

    selected = newSelected as DateRangeValue;
  });

  const showPeriodTypes = $derived(periodTypeOptions.length > 1);
  const showPresets = $derived(presetOptions.length > 0);
  const showSidebar = $derived(showPeriodTypes || showPresets);

  const dictionary = $derived(settings.localeSettings.dictionary);
</script>

<div
  {...restProps}
  class={cls(
    'DateRange grid gap-2',
    'w-[min(90vw,384px)]',
    showSidebar && 'md:w-[640px] md:grid-cols-[2fr_3fr]',
    settingsClasses.root,
    className
  )}
>
  <div class={cls(showSidebar && 'md:col-start-2')}>
    <ToggleGroup bind:value={activeDate} variant="outline" inset class="bg-surface-100">
      <ToggleOption value="from" class="flex-1">
        <div class="text-xs text-surface-content/50">{dictionary.Date.Start}</div>
        {#if selected?.from}
          <div class="font-medium">{settings.format(selected.from, PeriodType.Day, { utc })}</div>
        {:else}
          <div class="italic">{dictionary.Date.Empty}</div>
        {/if}
      </ToggleOption>

      <ToggleOption value="to" class="flex-1">
        <div class="text-xs text-surface-content/50">{dictionary.Date.End}</div>
        {#if selected?.to}
          <div class="font-medium">{settings.format(selected.to, PeriodType.Day, { utc })}</div>
        {:else}
          <div class="italic">{dictionary.Date.Empty}</div>
        {/if}
      </ToggleOption>
    </ToggleGroup>
  </div>

  {#if showSidebar}
    <div class="flex flex-col gap-2 md:gap-4 md:-mt-5">
      {#if showPeriodTypes}
        {#if media.mdScreen.current}
          <div>
            <div class="text-xs text-surface-content/50 uppercase mb-1">Type</div>
            <ToggleGroup
              bind:value={selectedPeriodType}
              onChange={({ value }) => onPeriodTypeChange(value)}
              variant="outline"
              inset
              vertical
            >
              {#each periodTypeOptions as option (option.value)}
                <ToggleOption value={option.value}>
                  {option.label}
                </ToggleOption>
              {/each}
            </ToggleGroup>
          </div>
        {:else}
          <MenuField
            label="Type"
            bind:value={selectedPeriodType}
            options={periodTypeOptions}
            onChange={({ value }) => onPeriodTypeChange(value)}
          />
        {/if}
      {/if}

      {#if showPresets}
        {#key selectedPeriodType}
          {#if media.mdScreen.current}
            <div>
              <div class="text-xs text-surface-content/50 uppercase mb-1">Presets</div>
              <ToggleGroup
                bind:value={selectedPreset}
                onChange={({ value }) => onPresetChange(value)}
                variant="outline"
                inset
                vertical
              >
                {#each presetOptions as option (option.value)}
                  <ToggleOption value={option.value}>
                    {option.label}
                  </ToggleOption>
                {/each}
              </ToggleGroup>
            </div>
          {:else}
            <MenuField
              label="Presets"
              bind:value={selectedPreset}
              options={presetOptions}
              onChange={({ value }) => onPresetChange(value)}
            />
          {/if}
        {/key}
      {/if}

      {#if hasDayOfWeek(selectedPeriodType)}
        <div>
          <div class="text-xs text-surface-content/50 uppercase mb-1">Start day of week</div>
          <ToggleGroup
            bind:value={selectedDayOfWeek}
            variant="outline"
            inset
            classes={{ root: 'bg-surface-100', option: 'px-0' }}
          >
            {#each [DayOfWeek.Sunday, DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday, DayOfWeek.Friday, DayOfWeek.Saturday] as day (day)}
              <ToggleOption value={day}>{settings.format.getDayOfWeekName(day)}</ToggleOption>
            {/each}
          </ToggleGroup>
        </div>
      {/if}
    </div>
  {/if}

  <div class="bg-surface-100 border rounded-sm overflow-auto">
    <DateSelect
      {selected}
      periodType={selectedPeriodType}
      {activeDate}
      {disabledDates}
      {utc}
      onDateChange={(date) => onDateChange(date)}
    />
  </div>
</div>
