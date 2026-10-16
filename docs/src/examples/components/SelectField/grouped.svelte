<script lang="ts">
  import { SelectField } from '@layerstack/ui';

  const options = [
    { label: 'Apple', value: 'apple', group: 'Fruit' },
    { label: 'Banana', value: 'banana', group: 'Fruit' },
    { label: 'Carrot', value: 'carrot', group: 'Vegetable' },
    { label: 'Potato', value: 'potato', group: 'Vegetable' },
  ];

  let value = $state<string | null>(null);
</script>

<div class="max-w-sm">
  <SelectField label="Produce" {options} bind:value />
</div>
