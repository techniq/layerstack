<script lang="ts">
  import { Radio } from '@layerstack/ui';

  let plan = $state('pro');
  let truncated = $state(0);
</script>

<div class="grid gap-6 max-w-sm">
  <!-- `fullWidth` stretches the hit area across the container -->
  <div class="border border-surface-content/10 rounded p-1">
    {#each ['free', 'pro', 'team'] as value (value)}
      <Radio name="plan" bind:group={plan} {value} fullWidth>{value}</Radio>
    {/each}
  </div>

  <!-- Long labels truncate rather than overflow when told to -->
  <div class="border border-surface-content/10 rounded w-[150px] p-1">
    {#each [0, 1, 2] as i (i)}
      <Radio
        name="truncate"
        bind:group={truncated}
        value={i}
        classes={{ root: 'truncate max-w-full', label: 'truncate' }}
      >
        This is a really long label {i}
      </Radio>
    {/each}
  </div>
</div>
