<script lang="ts">
  import { Grid } from '@layerstack/ui';
</script>

<!-- `autoColumns` fills as many columns as fit at the given minimum width -->
<Grid autoColumns="120px" gap={8}>
  {#each Array.from({ length: 8 }, (_, i) => i + 1) as n (n)}
    <div class="bg-surface-200 rounded-sm p-4 text-center">{n}</div>
  {/each}
</Grid>
