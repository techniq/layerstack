<script lang="ts">
  import { MenuButton, MenuItem } from '@layerstack/ui';

  const options = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
  ];

  let value = $state('medium');
</script>

<MenuButton {options} bind:value variant="outline">
  {#snippet children({ options, selected, setValue, close })}
    <menu class="group p-1 w-40">
      {#each options as option (option.value)}
        <MenuItem
          selected={option.value === selected?.value}
          onclick={() => {
            setValue(option.value);
            close();
          }}
        >
          <span class="flex-1 text-left">{option.label}</span>
          <span class="text-xs text-surface-content/50">{option.value}</span>
        </MenuItem>
      {/each}
    </menu>
  {/snippet}
</MenuButton>
