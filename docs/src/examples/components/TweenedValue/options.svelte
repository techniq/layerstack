<script lang="ts">
  import { Button, ButtonGroup, TweenedValue } from '@layerstack/ui';

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
      <TweenedValue {value} format="integer" />
      <span class="text-sm text-surface-content/50">integer</span>
    </div>
    <div>
      <TweenedValue {value} format="currency" />
      <span class="text-sm text-surface-content/50">currency</span>
    </div>
    <div>
      <TweenedValue {value} format="integer" options={{ duration: 2000 }} />
      <span class="text-sm text-surface-content/50">2s duration</span>
    </div>
    <div>
      <TweenedValue {value} disabled />
      <span class="text-sm text-surface-content/50">disabled (no animation)</span>
    </div>
  </div>

  <!-- The children snippet receives the animating value, for custom rendering -->
  <div class="text-2xl">
    <TweenedValue {value}>
      {#snippet children({ value })}
        <span class="tabular-nums {(value ?? 0) > 5000 ? 'text-danger' : 'text-success'}">
          {Math.round(value ?? 0)}
        </span>
      {/snippet}
    </TweenedValue>
  </div>
</div>
