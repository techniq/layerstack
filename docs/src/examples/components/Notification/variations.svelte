<script lang="ts">
  import { Notification } from '@layerstack/ui';
  import { mdiCheckCircle } from '@mdi/js';

  const actions = { Undo: () => alert('Undo'), Dismiss: () => {} };
</script>

<div class="grid gap-3 max-w-md">
  <Notification title="Saved" open />
  <Notification title="Saved" description="Your changes are live." icon={mdiCheckCircle} open />

  <!-- Actions come from a `{ label: handler }` map -->
  <Notification title="Deleted" description="The item was removed." {actions} open />
  <Notification
    title="Below"
    description="Actions on their own row"
    {actions}
    actionsPlacement="below"
    open
  />
  <Notification
    title="Split"
    description="Actions stacked to the side"
    {actions}
    actionsPlacement="split"
    open
  />
</div>
