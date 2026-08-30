<script lang="ts">
  import { YearList } from '@layerstack/ui';

  let selected = $state<Date | null>(new Date());
</script>

<div class="border rounded-sm w-40 max-h-72 overflow-auto">
  <YearList {selected} onDateChange={(date) => (selected = date)} />
</div>
