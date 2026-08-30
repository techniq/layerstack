<script lang="ts">
  import { DateButton } from '@layerstack/ui';
  import { PeriodType } from '@layerstack/utils';

  const today = new Date();
  const days = Array.from(
    { length: 7 },
    (_, i) => new Date(today.getFullYear(), today.getMonth(), i + 1)
  );

  let selected = $state<Date | null>(days[2]);
</script>

<div class="flex gap-1">
  {#each days as day (day.valueOf())}
    <DateButton
      date={day}
      periodType={PeriodType.Day}
      {selected}
      onDateChange={(date) => (selected = date)}
    />
  {/each}
</div>
