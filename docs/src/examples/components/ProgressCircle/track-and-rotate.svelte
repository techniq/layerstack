<script lang="ts">
  import { ProgressCircle } from '@layerstack/ui';
</script>

<div class="grid gap-4">
  <!-- `track` shows the unfilled remainder -->
  <div class="flex gap-4 items-center">
    {#each [0, 25, 50, 75, 100] as value (value)}
      <ProgressCircle {value} track />
    {/each}
  </div>

  <!-- `rotate` moves where 0% starts -->
  <div class="flex gap-4 items-center">
    {#each [0, 90, 180, 270] as rotate (rotate)}
      <ProgressCircle value={30} {rotate} track />
    {/each}
  </div>

  <!-- `width` is the stroke thickness -->
  <div class="flex gap-4 items-center">
    {#each [2, 4, 8, 12] as width (width)}
      <ProgressCircle value={60} {width} size={48} track />
    {/each}
  </div>
</div>
