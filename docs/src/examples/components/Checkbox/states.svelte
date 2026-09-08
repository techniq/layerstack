<script lang="ts">
  import { Checkbox } from '@layerstack/ui';
</script>

<div class="grid gap-4">
  <div class="flex gap-4 items-center">
    {#each ['xs', 'sm', 'md', 'lg'] as const as size (size)}
      <Checkbox {size} checked>{size}</Checkbox>
    {/each}
  </div>

  <div class="flex gap-4 items-center">
    <Checkbox checked circle>Circle</Checkbox>
    <Checkbox indeterminate>Indeterminate</Checkbox>
    <Checkbox disabled>Disabled</Checkbox>
    <Checkbox disabled checked>Disabled checked</Checkbox>
  </div>
</div>
