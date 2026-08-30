<script lang="ts">
  import { Button } from '@layerstack/ui';

  const colors = [
    'default',
    'primary',
    'secondary',
    'accent',
    'neutral',
    'info',
    'success',
    'warning',
    'danger',
  ] as const;
</script>

<div class="flex flex-wrap gap-2">
  {#each colors as color (color)}
    <Button variant="fill" {color}>{color}</Button>
  {/each}
</div>
