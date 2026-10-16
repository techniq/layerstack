<script lang="ts">
  import { SelectField } from '@layerstack/ui';

  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
  ];

  let value = $state<string | null>(null);
</script>

<div class="max-w-sm rounded border border-surface-content/10 p-2">
  <SelectField placeholder="Search fruit..." {options} bind:value inlineOptions />
</div>
