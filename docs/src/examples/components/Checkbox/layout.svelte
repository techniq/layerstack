<script lang="ts">
  import { Checkbox } from '@layerstack/ui';
</script>

<div class="grid gap-6 max-w-sm">
  <!-- `fullWidth` stretches the hit area across the container -->
  <div class="border border-surface-content/10 rounded p-1">
    {#each ['Email', 'SMS', 'Push'] as label (label)}
      <Checkbox fullWidth>{label}</Checkbox>
    {/each}
  </div>

  <!-- Long labels truncate rather than overflow when told to -->
  <div class="border border-surface-content/10 rounded w-[150px] p-1">
    {#each [0, 1, 2] as i (i)}
      <Checkbox classes={{ root: 'truncate max-w-full', label: 'truncate' }}>
        This is a really long label {i}
      </Checkbox>
    {/each}
  </div>
</div>
