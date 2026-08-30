<script lang="ts">
  import { DateField } from '@layerstack/ui';
  import { DateToken } from '@layerstack/utils';

  let value = $state<Date | null>(new Date());
  let utcValue = $state<Date | null>(new Date());
</script>

<div class="grid gap-4 max-w-sm">
  <DateField label="With picker" bind:value picker clearable />
  <DateField label="Error" value={null} error="Date is required" />
  <DateField label="Hint" hint="Typing is masked to the format" />
  <DateField label="Disabled" value={new Date()} disabled />

  <!-- An explicit format overrides the locale's default, for both parsing and display -->
  <DateField
    label="ISO format"
    value={new Date()}
    format={[DateToken.Year_numeric, DateToken.Month_2Digit, DateToken.DayOfMonth_2Digit].join('-')}
  />

  <!-- `utc` parses to UTC midnight rather than local midnight -->
  <DateField label="UTC" bind:value={utcValue} utc />
</div>

<div class="mt-3 text-sm text-surface-content/70">
  <div>local: {value?.toISOString() ?? '(none)'}</div>
  <div>utc: {utcValue?.toISOString() ?? '(none)'}</div>
</div>
