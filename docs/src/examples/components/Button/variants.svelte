<script lang="ts">
  import { Button } from '@layerstack/ui';

  const variants = ['default', 'outline', 'fill', 'fill-outline', 'fill-light', 'text'] as const;
</script>

<div class="flex flex-wrap gap-2">
  {#each variants as variant (variant)}
    <Button {variant} color="primary">{variant}</Button>
  {/each}
</div>
