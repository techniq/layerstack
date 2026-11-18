<script lang="ts">
  import { Radio } from '@layerstack/ui';

  const options = ['Small', 'Medium', 'Large'];
  let group = $state('Medium');
</script>

<div class="grid gap-2">
  {#each options as option (option)}
    <Radio bind:group value={option} name="size">{option}</Radio>
  {/each}
</div>

<div class="mt-3 text-sm text-surface-content/70">Selected: {group}</div>
