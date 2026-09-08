<script lang="ts">
  import { Button, ButtonGroup } from '@layerstack/ui';

  const variants = ['default', 'outline', 'fill', 'fill-outline', 'fill-light'] as const;
</script>

<div class="grid gap-3">
  {#each variants as variant (variant)}
    <ButtonGroup {variant} color="primary">
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </ButtonGroup>
  {/each}
</div>
