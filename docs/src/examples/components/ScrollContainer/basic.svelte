<script lang="ts">
  import { Button, ScrollContainer } from '@layerstack/ui';
</script>

<div class="grid gap-2">
  <ScrollContainer class="h-32 overflow-auto border rounded-sm p-2">
    {#snippet children({ scrollIntoView })}
      <Button variant="outline" onclick={() => scrollIntoView({ block: 'center' })}>
        Scroll me into view
      </Button>
      {#each Array.from({ length: 20 }, (_, i) => i) as n (n)}
        <div class="py-1 text-sm text-surface-content/70">Row {n}</div>
      {/each}
    {/snippet}
  </ScrollContainer>
</div>
