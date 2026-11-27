<script lang="ts">
  import { Button, ButtonGroup } from '@layerstack/ui';

  const options = ['Day', 'Week', 'Month'];
  let selected = $state('Week');
</script>

<ButtonGroup variant="outline" color="primary">
  {#each options as option (option)}
    <Button variant={selected === option ? 'fill' : 'outline'} onclick={() => (selected = option)}>
      {option}
    </Button>
  {/each}
</ButtonGroup>

<div class="mt-3 text-sm text-surface-content/70">Selected: {selected}</div>
