<script lang="ts">
  import { DateRangeDisplay } from '@layerstack/ui';
  import { PeriodType } from '@layerstack/utils';

  const single = {
    from: new Date(2024, 0, 15),
    to: new Date(2024, 0, 15),
    periodType: PeriodType.Day,
  };
  const range = {
    from: new Date(2024, 0, 15),
    to: new Date(2024, 1, 20),
    periodType: PeriodType.Day,
  };
</script>

<div class="grid gap-2 text-sm">
  <div><DateRangeDisplay value={single} /></div>
  <div><DateRangeDisplay value={range} /></div>
</div>
