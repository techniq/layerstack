<script lang="ts">
  import { Grid } from '@layerstack/ui';
</script>

<div class="grid gap-4">
  <!-- Uniform columns -->
  <div>
    <div class="text-xs uppercase text-surface-content/50 mb-1">columns={4} gap={8}</div>
    <Grid columns={4} gap={8}>
      {#each [1, 2, 3, 4, 5, 6] as i (i)}
        <div class="border border-surface-content/20 rounded px-2 text-sm">item {i}</div>
      {/each}
    </Grid>
  </div>

  <!-- Explicit tracks -->
  <div>
    <div class="text-xs uppercase text-surface-content/50 mb-1">templateColumns</div>
    <Grid templateColumns="auto 1fr auto" gap={8}>
      <div class="border border-surface-content/20 rounded px-2 text-sm">auto</div>
      <div class="border border-surface-content/20 rounded px-2 text-sm">1fr</div>
      <div class="border border-surface-content/20 rounded px-2 text-sm">auto</div>
    </Grid>
  </div>

  <!-- Column flow, for horizontal scrollers -->
  <div>
    <div class="text-xs uppercase text-surface-content/50 mb-1">autoFlow="column"</div>
    <Grid autoFlow="column" autoColumns="120px" gap={8} class="overflow-auto">
      {#each [1, 2, 3, 4, 5, 6, 7, 8] as i (i)}
        <div class="border border-surface-content/20 rounded px-2 text-sm">item {i}</div>
      {/each}
    </Grid>
  </div>
</div>
