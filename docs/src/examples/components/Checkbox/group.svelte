<script lang="ts">
  import { Checkbox } from '@layerstack/ui';

  const options = ['Email', 'SMS', 'Push'];
  let group = $state<string[]>(['Email']);
</script>

<div class="grid gap-2">
  {#each options as option (option)}
    <Checkbox bind:group value={option}>{option}</Checkbox>
  {/each}
</div>

<div class="mt-3 text-sm text-surface-content/70">Selected: {group.join(', ') || '(none)'}</div>
