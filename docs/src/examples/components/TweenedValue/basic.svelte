<script lang="ts">
  import { Button, TweenedValue } from '@layerstack/ui';

  let value = $state(0.25);
</script>

<div class="text-4xl font-bold tabular-nums">
  <TweenedValue {value} format="percentRound" options={{ duration: 800 }} />
</div>

<div class="flex gap-2 mt-4">
  <Button variant="outline" onclick={() => (value = Math.random())}>Randomize</Button>
</div>
