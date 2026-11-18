<script lang="ts">
  import Popover from '../Popover.svelte';

  let { open = $bindable(false), ...props }: Record<string, any> = $props();
</script>

<div class="anchor">
  <button data-testid="anchor" onclick={() => (open = !open)}>Toggle</button>

  <Popover bind:open {...props}>
    {#snippet children({ close })}
      <div data-testid="popover-content">Content</div>
      <button data-testid="close" onclick={() => close()}>Close</button>
    {/snippet}
  </Popover>
</div>

<output data-testid="open-state">{open}</output>
