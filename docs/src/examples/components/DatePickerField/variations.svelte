<script lang="ts">
  import { DatePickerField } from '@layerstack/ui';
  import { PeriodType } from '@layerstack/utils';

  let day = $state<Date | null>(new Date());
  let month = $state<Date | null>(new Date());
</script>

<div class="grid gap-4 max-w-sm">
  <DatePickerField label="Day" bind:value={day} clearable />

  <!-- `periodType` changes what the dialog picks, and what the stepper moves by -->
  <DatePickerField label="Month" bind:value={month} periodType={PeriodType.Month} stepper />
  <DatePickerField label="Year" value={new Date()} periodType={PeriodType.CalendarYear} stepper />

  <DatePickerField label="Rounded and centered" value={new Date()} stepper rounded center />

  <div class="flex gap-3 items-center">
    <!-- Just the calendar button, which is how DateField embeds it -->
    <DatePickerField iconOnly bind:value={day} />
    <span class="text-sm text-surface-content/70">iconOnly</span>
  </div>

  <DatePickerField label="Weekdays only" disabledDates={(d) => [0, 6].includes(d.getDay())} />
</div>
