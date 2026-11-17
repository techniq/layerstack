<script lang="ts">
  import { DatePickerField, MenuField } from 'svelte-ux';
  import { format, type PeriodTypeCode } from '@layerstack/utils';

  let myDate = new Date('1982-03-30T07:11:00');

  const periodTypeCodes: PeriodTypeCode[] = [
    'day',
    'daytime',
    'time',
    'week',
    'biweek1',
    'month',
    'month-year',
    'quarter',
    'year',
    'fiscal-year-october',
  ];
  let periodType: PeriodTypeCode = 'day';

  const locales = ['en', 'de', 'fr', 'it', 'es', 'jp', 'zh'] as const;
  let locale: (typeof locales)[number] = 'en';
</script>

<div class="grid grid-cols-xs gap-2 mb-2">
  <DatePickerField format="dd/MM/yyyy" label="date" bind:value={myDate}></DatePickerField>

  <MenuField
    label="periodType"
    bind:value={periodType}
    options={periodTypeCodes.map((value) => ({ label: value, value }))}
    stepper
  />

  <MenuField
    label="locale"
    bind:value={locale}
    options={locales.map((value) => ({ label: value, value }))}
    stepper
  />
</div>

<div>{format(myDate, { type: periodType, locale })}</div>
