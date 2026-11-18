<script lang="ts">
  import ToggleButton from '../ToggleButton.svelte';
  import ToggleGroup from '../ToggleGroup.svelte';
  import ToggleOption from '../ToggleOption.svelte';
  import TogglePanel from '../TogglePanel.svelte';

  let {
    kind = 'group',
    value = $bindable(),
    on = $bindable(false),
    options = ['a', 'b', 'c'],
    withPanels = false,
    ...props
  }: Record<string, any> = $props();
</script>

{#if kind === 'group'}
  <ToggleGroup bind:value {...props as any}>
    {#each options as option (option)}
      <ToggleOption value={option}>
        {#snippet children({ selected })}
          <span data-testid="option-{option}" data-selected={selected}>{option}</span>
        {/snippet}
      </ToggleOption>
    {/each}

    {#snippet panes()}
      {#if withPanels}
        {#each options as option (option)}
          <TogglePanel>
            <div data-testid="panel-{option}">panel {option}</div>
          </TogglePanel>
        {/each}
      {/if}
    {/snippet}
  </ToggleGroup>

  <output data-testid="value">{value ?? 'none'}</output>
{:else if kind === 'button'}
  <ToggleButton bind:on {...props as any}>
    {#snippet children({ on })}
      <span data-testid="label">{on ? 'On' : 'Off'}</span>
    {/snippet}
    {#snippet toggle()}
      <div data-testid="toggled">toggled content</div>
    {/snippet}
  </ToggleButton>
{/if}
