<script lang="ts">
  import { subDays, subMonths } from 'date-fns';

  import Preview from '$docs/Preview.svelte';

  import { Duration, DurationUnits } from '@layerstack/utils';
</script>

<h1>Examples</h1>

<h2>new Duration()</h2>

<h3>Date range</h3>

<Preview class="whitespace-pre">
  <div>{JSON.stringify(new Duration({ start: subDays(new Date(), 3) }), null, 2)}</div>
</Preview>

<h3>Date range</h3>

<Preview class="whitespace-pre">
  <div>{JSON.stringify(new Duration({ start: '2021-01-01', end: '2021-01-07' }), null, 2)}</div>
</Preview>

<h2>duration.format()</h2>

<h3>Date range</h3>

<Preview>
  <div>{new Duration({ start: subDays(new Date(), 3) }).format()}</div>
  <div>{new Duration({ start: subMonths(new Date(), 3) }).format()}</div>
  <div>{new Duration({ start: subMonths(new Date(), 3) }).format({ variant: 'long' })}</div>
</Preview>

<h3>string range</h3>

<Preview>
  <div>{new Duration({ start: '1982-03-30' }).format()}</div>
  <div>{new Duration({ start: '2021-01-01', end: '2021-01-07' }).format()}</div>
  <div>{new Duration({ start: '1982-03-30' }).format({ totalUnits: 2 })}</div>
  <div>{new Duration({ start: '1982-03-30' }).format({ minUnits: DurationUnits.Hour })}</div>
</Preview>

<h3>duration object</h3>

<Preview>
  <div>{new Duration({ duration: { milliseconds: 300 } }).format()}</div>
  <div>{new Duration({ duration: { hours: 1, minutes: 30 } }).format()}</div>
  <div>{new Duration({ duration: { days: 5, hours: 26 } }).format()}</div>
</Preview>

<h3>Leap year comparison</h3>

<Preview>
  <div>{new Duration({ start: new Date('2023-02-28'), end: new Date('2023-03-01') }).format()}</div>
  <div>{new Duration({ start: new Date('2024-02-28'), end: new Date('2024-03-01') }).format()}</div>
</Preview>
