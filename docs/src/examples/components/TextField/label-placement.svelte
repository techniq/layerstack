<script lang="ts">
  import { TextField } from '@layerstack/ui';

  const placements = ['inset', 'float', 'top', 'left'] as const;
</script>

<div class="grid gap-4 max-w-sm">
  {#each placements as labelPlacement (labelPlacement)}
    <TextField label={labelPlacement} {labelPlacement} />
  {/each}
</div>
