<script lang="ts">
  import { MultiSelectOption } from '@layerstack/ui';

  let checkbox = $state(true);
  let checkmark = $state(true);
  let fill = $state(true);
</script>

<div class="grid gap-2 max-w-xs">
  <MultiSelectOption bind:checked={checkbox}>Checkbox</MultiSelectOption>

  <!-- `checkmark` and `fill` report the click rather than toggling `checked` themselves -->
  <MultiSelectOption
    checked={checkmark}
    variant="checkmark"
    onChange={() => (checkmark = !checkmark)}
  >
    Checkmark
  </MultiSelectOption>

  <MultiSelectOption checked={fill} variant="fill" onChange={() => (fill = !fill)}>
    Fill
  </MultiSelectOption>

  <MultiSelectOption checked={false} indeterminate>Indeterminate</MultiSelectOption>
  <MultiSelectOption checked={false} disabled>Disabled</MultiSelectOption>
</div>
