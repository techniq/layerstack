<script lang="ts">
  import { Button, Menu, MenuItem } from '@layerstack/ui';

  let open = $state(false);
  const options = ['Red', 'Green', 'Blue'];
  let checked = $state<string[]>([]);

  function toggle(option: string) {
    checked = checked.includes(option) ? checked.filter((c) => c !== option) : [...checked, option];
  }
</script>

<div class="relative inline-block">
  <Button variant="outline" onclick={() => (open = !open)}>Filters</Button>

  <!-- `explicitClose` keeps the menu open while toggling several options -->
  <Menu bind:open explicitClose>
    {#snippet children({ close })}
      {#each options as option (option)}
        <MenuItem selected={checked.includes(option)} onclick={() => toggle(option)}>
          {option}
        </MenuItem>
      {/each}
      <MenuItem onclick={() => close()}>Done</MenuItem>
    {/snippet}
  </Menu>
</div>

<div class="mt-3 text-sm text-surface-content/70">Checked: {checked.join(', ') || '(none)'}</div>
