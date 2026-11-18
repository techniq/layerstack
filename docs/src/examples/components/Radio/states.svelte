<script lang="ts">
  import { Radio } from '@layerstack/ui';

  let size = $state(1);
</script>

<div class="grid gap-4">
  <div class="flex gap-4 items-center">
    {#each ['xs', 'sm', 'md', 'lg'] as const as s (s)}
      <Radio name="sizes" bind:group={size} value={s} size={s}>{s}</Radio>
    {/each}
  </div>

  <div class="flex gap-4 items-center">
    <Radio disabled />
    <Radio disabled checked />
    <Radio disabled>Disabled with label</Radio>
  </div>
</div>
