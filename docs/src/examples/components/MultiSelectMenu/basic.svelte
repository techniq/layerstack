<script lang="ts">
  import { Button, MultiSelectMenu } from '@layerstack/ui';

  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
  ];

  let value = $state<string[]>(['apple']);
  let open = $state(false);
</script>

<div class="relative inline-block">
  <Button variant="outline" onclick={() => (open = !open)}>
    Fruit ({value.length})
  </Button>

  <MultiSelectMenu {options} bind:value bind:open />
</div>

<div class="mt-3 text-sm text-surface-content/70">Value: {value.join(', ') || '(none)'}</div>
