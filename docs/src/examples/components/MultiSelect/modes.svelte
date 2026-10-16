<script lang="ts">
  import { MultiSelect } from '@layerstack/ui';

  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
  ];

  let staged = $state<string[]>([]);
  let immediate = $state<string[]>([]);
</script>

<div class="grid grid-cols-2 gap-4">
  <div>
    <div class="text-sm mb-1">actions (default)</div>
    <div class="rounded border border-surface-content/10">
      <MultiSelect {options} bind:value={staged} />
    </div>
    <div class="mt-2 text-sm text-surface-content/70">{staged.join(', ') || '(none)'}</div>
  </div>

  <div>
    <div class="text-sm mb-1">immediate</div>
    <div class="rounded border border-surface-content/10">
      <MultiSelect {options} bind:value={immediate} mode="immediate" />
    </div>
    <div class="mt-2 text-sm text-surface-content/70">{immediate.join(', ') || '(none)'}</div>
  </div>
</div>
