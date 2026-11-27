<script lang="ts">
  import { Field } from '@layerstack/ui';
</script>

<div class="grid grid-cols-2 gap-4 max-w-lg">
  {#each ['inset', 'float', 'top', 'left'] as const as labelPlacement (labelPlacement)}
    <Field label={labelPlacement} {labelPlacement} value="Value">Value</Field>
  {/each}
</div>
