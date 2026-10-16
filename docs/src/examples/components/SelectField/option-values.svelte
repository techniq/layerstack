<script lang="ts">
  import { SelectField } from '@layerstack/ui';

  // Values do not have to be strings
  const objectOptions = [
    { label: 'Small', value: { width: 100, height: 100 } },
    { label: 'Medium', value: { width: 200, height: 200 } },
    { label: 'Large', value: { width: 400, height: 400 } },
  ];

  // The same value may appear in more than one group
  const groupedOptions = [
    { label: 'Apple', value: 'apple', group: 'Fruit' },
    { label: 'Tomato', value: 'tomato', group: 'Fruit' },
    { label: 'Tomato', value: 'tomato', group: 'Vegetable' },
  ];

  let size = $state(objectOptions[1].value);
  let produce = $state<string | null>(null);
</script>

<div class="grid gap-4 max-w-sm">
  <SelectField label="Object values" options={objectOptions} bind:value={size} />
  <SelectField
    label="Duplicate values across groups"
    options={groupedOptions}
    bind:value={produce}
  />

  <!-- Case-sensitive search, replacing the default -->
  <SelectField
    label="Case-sensitive search"
    options={groupedOptions}
    search={(text, options) => options.filter((o) => o.label.includes(text))}
  />
</div>

<div class="mt-3 text-sm text-surface-content/70">
  {JSON.stringify(size)} &middot; {produce ?? '(none)'}
</div>
