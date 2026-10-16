<script lang="ts">
  import { Button, ButtonGroup, SpringValue } from '@layerstack/ui';

  let value = $state(1234);
</script>

<div class="grid gap-4">
  <ButtonGroup variant="fill-light" class="w-fit">
    <Button onclick={() => (value -= 100)}>-100</Button>
    <Button onclick={() => (value = 0)}>0</Button>
    <Button onclick={() => (value += 100)}>+100</Button>
    <Button onclick={() => (value = Math.round(Math.random() * 10000))}>Random</Button>
  </ButtonGroup>

  <div class="grid gap-2 text-2xl tabular-nums">
    <div>
      <SpringValue {value} format="integer" />
      <span class="text-sm text-surface-content/50">integer</span>
    </div>
    <div>
      <SpringValue {value} format="currency" />
      <span class="text-sm text-surface-content/50">currency</span>
    </div>
    <div>
      <SpringValue {value} format="integer" options={{ stiffness: 0.01, damping: 0.25 }} />
      <span class="text-sm text-surface-content/50">slower spring</span>
    </div>
    <div>
      <SpringValue {value} disabled />
      <span class="text-sm text-surface-content/50">disabled (no animation)</span>
    </div>
  </div>

  <!-- The children snippet receives the animating value, for custom rendering -->
  <div class="text-2xl">
    <SpringValue {value}>
      {#snippet children({ value })}
        <span class="tabular-nums {(value ?? 0) > 5000 ? 'text-danger' : 'text-success'}">
          {Math.round(value ?? 0)}
        </span>
      {/snippet}
    </SpringValue>
  </div>
</div>
