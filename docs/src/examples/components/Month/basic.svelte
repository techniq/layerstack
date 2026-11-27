<script lang="ts">
  import { Month } from '@layerstack/ui';

  let selected = $state<Date | null>(new Date());
</script>

<div class="border rounded-sm p-2 w-80">
  <Month {selected} showOutsideDays onDateChange={(date) => (selected = date)} />
</div>

<div class="mt-3 text-sm text-surface-content/70">
  Selected: {selected?.toLocaleDateString() ?? '(none)'}
</div>
