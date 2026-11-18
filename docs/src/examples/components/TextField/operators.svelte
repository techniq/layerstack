<script lang="ts">
  import { TextField } from '@layerstack/ui';

  // With `operators`, the value becomes `{ [operator]: value }`
  let value = $state<any>('');
</script>

<div class="grid gap-4 max-w-sm">
  <TextField
    label="Amount"
    type="integer"
    bind:value
    operators={[
      { label: '=', value: 'eq' },
      { label: '>', value: 'gt' },
      { label: '<', value: 'lt' },
    ]}
  />
  <div class="text-sm text-surface-content/70">Value: <code>{JSON.stringify(value)}</code></div>
</div>
