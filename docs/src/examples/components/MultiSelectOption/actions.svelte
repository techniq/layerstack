<script lang="ts">
  import { Button, MultiSelectOption } from '@layerstack/ui';
  import { mdiTrashCan } from '@mdi/js';

  let checked = $state(true);
</script>

<div class="max-w-xs">
  <MultiSelectOption bind:checked>
    Apple

    {#snippet actions()}
      <Button icon={mdiTrashCan} size="sm" onclick={() => alert('Remove')} />
    {/snippet}
  </MultiSelectOption>
</div>
