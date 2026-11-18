<script lang="ts">
  import { Button, MenuItem, SelectField } from '@layerstack/ui';

  const options = [
    { label: 'Ada Lovelace', value: 'ada', role: 'Mathematician' },
    { label: 'Grace Hopper', value: 'grace', role: 'Rear Admiral' },
    { label: 'Alan Turing', value: 'alan', role: 'Logician' },
  ];

  let value = $state<string | null>(null);
</script>

<div class="max-w-sm">
  <SelectField label="Person" {options} bind:value>
    {#snippet option({ option, index, highlightIndex })}
      <MenuItem class={index === highlightIndex ? 'bg-surface-content/5' : ''}>
        <div class="text-left">
          <div>{option.label}</div>
          <div class="text-xs text-surface-content/50">{option.role}</div>
        </div>
      </MenuItem>
    {/snippet}

    {#snippet actions({ hide })}
      <Button size="sm" onclick={hide}>Close</Button>
    {/snippet}
  </SelectField>
</div>
