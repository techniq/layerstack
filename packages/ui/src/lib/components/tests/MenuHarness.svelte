<script lang="ts">
  import Menu from '../Menu.svelte';
  import MenuItem from '../MenuItem.svelte';

  let {
    open = $bindable(false),
    items = ['One', 'Two', 'Three'],
    selectedIndex = -1,
    onItemClick,
    ...menuProps
  }: Record<string, any> = $props();
</script>

<div class="anchor">
  <button data-testid="anchor" onclick={() => (open = !open)}>Toggle</button>

  <Menu bind:open {...menuProps}>
    {#snippet children({ close })}
      {#each items as item, i (item)}
        <MenuItem
          selected={i === selectedIndex}
          scrollIntoView={i === selectedIndex}
          onclick={() => onItemClick?.(item)}
        >
          {item}
        </MenuItem>
      {/each}
      <button data-testid="explicit-close" onclick={() => close()}>Close</button>
    {/snippet}
  </Menu>
</div>

<output data-testid="open-state">{open}</output>
