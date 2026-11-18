<script lang="ts">
  import Settings from '../Settings.svelte';
  import DateButton from '../DateButton.svelte';
  import DateField from '../DateField.svelte';
  import DatePickerField from '../DatePickerField.svelte';
  import DateRangeDisplay from '../DateRangeDisplay.svelte';
  import DateSelect from '../DateSelect.svelte';
  import Month from '../Month.svelte';
  import MonthList from '../MonthList.svelte';
  import YearList from '../YearList.svelte';

  let { kind, value = $bindable(null), ...props }: Record<string, any> = $props();
</script>

<Settings themeInit={false}>
  {#if kind === 'date-button'}
    <DateButton {...props as any} />
  {:else if kind === 'month'}
    <Month {...props as any} />
  {:else if kind === 'month-list'}
    <div><MonthList {...props as any} /></div>
  {:else if kind === 'year-list'}
    <YearList {...props as any} />
  {:else if kind === 'date-select'}
    <DateSelect {...props as any} />
  {:else if kind === 'range-display'}
    <DateRangeDisplay {value} {...props as any} />
  {:else if kind === 'date-field'}
    <DateField bind:value {...props as any} />
    <output data-testid="value">{value ? value.toISOString() : 'null'}</output>
  {:else if kind === 'picker-field'}
    <DatePickerField bind:value {...props as any} />
    <output data-testid="value">{value ? value.toISOString() : 'null'}</output>
  {/if}
</Settings>
