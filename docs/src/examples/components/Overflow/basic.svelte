<script lang="ts">
  import { Overflow } from '@layerstack/ui';

  let width = $state(200);
</script>

<label class="flex items-center gap-2 mb-3 text-sm">
  Container width
  <input type="range" bind:value={width} min={100} max={500} />
  <span class="tabular-nums">{width}px</span>
</label>

<Overflow class="border rounded-sm p-2 overflow-hidden" style="width: {width}px">
  {#snippet children({ overflowX })}
    <div class="whitespace-nowrap text-sm">
      This line is wider than most container widths you can pick.
    </div>
    <div class="mt-2 text-xs text-surface-content/50">Overflowing by {overflowX}px</div>
  {/snippet}
</Overflow>
