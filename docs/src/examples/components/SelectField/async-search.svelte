<script lang="ts">
  import { SelectField } from '@layerstack/ui';

  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Dragonfruit', value: 'dragonfruit' },
    { label: 'Elderberry', value: 'elderberry' },
  ];

  let value = $state<string | null>(null);
  let loading = $state(false);

  async function search(text: string) {
    loading = true;
    // Stands in for a network request
    await new Promise((resolve) => setTimeout(resolve, 400));
    loading = false;
    return options.filter((o) => o.label.toLowerCase().includes(text.toLowerCase()));
  }
</script>

<div class="max-w-sm">
  <SelectField label="Fruit" {options} bind:value {search} {loading} />
</div>
