<script lang="ts">
  import { Button, ScrollingValue } from '@layerstack/ui';

  let value = $state(3);
</script>

<div class="text-4xl font-bold tabular-nums">
  <ScrollingValue {value} />
</div>

<div class="flex gap-2 mt-4">
  <Button variant="outline" onclick={() => value--}>−</Button>
  <Button variant="outline" onclick={() => value++}>+</Button>
</div>
