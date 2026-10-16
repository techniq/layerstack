<script lang="ts">
  import { Button } from '@layerstack/ui';
  import { mdiPlus, mdiTrashCan } from '@mdi/js';
</script>

<div class="flex flex-wrap items-center gap-2">
  <Button icon={mdiPlus} variant="fill" color="primary">Add</Button>
  <Button icon={mdiTrashCan} variant="fill" color="danger">Delete</Button>

  <!-- An icon with no label becomes a round icon-only button -->
  <Button icon={mdiPlus} variant="fill" color="primary" />
  <Button icon={mdiTrashCan} variant="outline" color="danger" />
</div>
