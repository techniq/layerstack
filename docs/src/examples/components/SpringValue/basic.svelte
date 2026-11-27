<script lang="ts">
  import { Button, SpringValue } from '@layerstack/ui';

  let value = $state(100);
</script>

<div class="text-4xl font-bold tabular-nums">
  <SpringValue {value} format="integer" />
</div>

<div class="flex gap-2 mt-4">
  <Button variant="outline" onclick={() => (value = Math.round(Math.random() * 1000))}>
    Randomize
  </Button>
  <Button variant="outline" onclick={() => (value = 0)}>Reset</Button>
</div>
