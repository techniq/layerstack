<script lang="ts">
  import { Button, ButtonGroup, ScrollingValue } from '@layerstack/ui';

  let value = $state(42);
</script>

<div class="grid gap-6">
  <ButtonGroup variant="fill-light" class="w-fit">
    <Button onclick={() => (value -= 10)}>-10</Button>
    <Button onclick={() => (value -= 1)}>-1</Button>
    <Button onclick={() => (value += 1)}>+1</Button>
    <Button onclick={() => (value += 10)}>+10</Button>
  </ButtonGroup>

  <div class="flex gap-8 items-center">
    <div>
      <div class="text-xs uppercase text-surface-content/50 mb-1">axis y (default)</div>
      <ScrollingValue {value} class="text-3xl tabular-nums" />
    </div>

    <div>
      <div class="text-xs uppercase text-surface-content/50 mb-1">axis x</div>
      <ScrollingValue {value} axis="x" class="text-3xl tabular-nums" />
    </div>

    <div>
      <div class="text-xs uppercase text-surface-content/50 mb-1">per digit</div>
      <!-- `single` wraps 9 back to 0, so each digit scrolls independently -->
      <div class="flex">
        {#each Math.abs(value).toString().split('') as digit, i (i)}
          <ScrollingValue value={Number(digit)} single class="text-3xl tabular-nums" />
        {/each}
      </div>
    </div>

    <div>
      <div class="text-xs uppercase text-surface-content/50 mb-1">formatted</div>
      <ScrollingValue {value} format={(v) => `${v}%`} class="text-3xl tabular-nums" />
    </div>
  </div>
</div>
