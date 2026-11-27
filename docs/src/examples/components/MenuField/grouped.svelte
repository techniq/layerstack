<script lang="ts">
  import { MenuField } from '@layerstack/ui';

  const options = [
    { label: 'Apple', value: 'apple', group: 'Fruit' },
    { label: 'Banana', value: 'banana', group: 'Fruit' },
    { label: 'Carrot', value: 'carrot', group: 'Vegetable' },
    { label: 'Potato', value: 'potato', group: 'Vegetable' },
  ];

  let value = $state('banana');
</script>

<div class="max-w-sm">
  <MenuField label="Produce" {options} bind:value />
</div>
