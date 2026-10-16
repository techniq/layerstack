<script lang="ts">
  import { Grid } from '@layerstack/ui';
</script>

<Grid columns={3} gap={8}>
  {#each Array.from({ length: 6 }, (_, i) => i + 1) as n (n)}
    <div class="bg-surface-200 rounded-sm p-4 text-center">{n}</div>
  {/each}
</Grid>
