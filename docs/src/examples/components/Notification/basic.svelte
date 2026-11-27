<script lang="ts">
  import { Button, Notification } from '@layerstack/ui';
  import { mdiCheckCircle } from '@mdi/js';

  let open = $state(true);
</script>

<div class="grid gap-4 max-w-lg">
  {#if !open}
    <Button variant="outline" onclick={() => (open = true)}>Show notification</Button>
  {/if}

  <Notification
    bind:open
    icon={mdiCheckCircle}
    color="success"
    title="Changes saved"
    description="Your profile has been updated."
    actions={{ Undo: () => console.log('undo'), Dismiss: () => {} }}
  />

  <Notification
    title="Storage almost full"
    description="You are using 92% of your quota."
    color="warning"
    variant="fill"
    actionsPlacement="split"
    actions={{ Upgrade: () => {}, Later: () => {} }}
  />
</div>
