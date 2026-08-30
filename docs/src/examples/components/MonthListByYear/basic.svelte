<script lang="ts">
  import { MonthListByYear } from '@layerstack/ui';

  let selected = $state<Date | null>(new Date());
</script>

<div class="border rounded-sm max-h-80 overflow-auto max-w-md">
  <MonthListByYear {selected} onDateChange={(date) => (selected = date)} />
</div>
