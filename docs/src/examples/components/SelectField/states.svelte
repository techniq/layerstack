<script lang="ts">
  import { SelectField } from '@layerstack/ui';

  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana', disabled: true },
    { label: 'Cherry', value: 'cherry' },
  ];
</script>

<div class="grid gap-4 max-w-sm">
  <SelectField label="Error" {options} error="Selection is required" />
  <SelectField label="Loading" {options} loading />
  <SelectField label="Disabled" {options} value="apple" disabled />

  <!-- `readonly` shows the value without the chevron or clear button -->
  <SelectField label="Readonly" {options} value="apple" readonly />

  <SelectField label="Not clearable" {options} value="apple" clearable={false} />

  <!-- Individual options can be disabled -->
  <SelectField label="Disabled option" {options} inlineOptions />
</div>
