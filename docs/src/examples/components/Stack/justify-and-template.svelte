<script lang="ts">
  import { Stack } from '@layerstack/ui';

  const justifications = ['start', 'center', 'end', 'between'] as const;
</script>

<div class="grid gap-4">
  {#each justifications as justify (justify)}
    <div>
      <div class="text-xs uppercase text-surface-content/50 mb-1">{justify}</div>
      <Stack horizontal {justify} gap={8} class="border border-surface-content/10 rounded p-2">
        {#each [1, 2, 3] as i (i)}
          <div class="border border-surface-content/20 rounded px-2">item {i}</div>
        {/each}
      </Stack>
    </div>
  {/each}

  <!-- `template` sizes the tracks explicitly -->
  <div>
    <div class="text-xs uppercase text-surface-content/50 mb-1">template</div>
    <Stack
      horizontal
      template="auto 1fr auto"
      gap={8}
      class="border border-surface-content/10 rounded p-2"
    >
      <div class="border border-surface-content/20 rounded px-2">auto</div>
      <div class="border border-surface-content/20 rounded px-2">1fr</div>
      <div class="border border-surface-content/20 rounded px-2">auto</div>
    </Stack>
  </div>
</div>
