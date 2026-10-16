<script lang="ts">
  import { Icon, Switch } from '@layerstack/ui';
  import { mdiCheck, mdiClose } from '@mdi/js';
</script>

<div class="grid gap-3">
  <label class="flex gap-2 items-center text-sm w-fit">
    <Switch /> Notifications
  </label>

  <!-- The children snippet renders inside the knob -->
  <Switch checked>
    {#snippet children({ checked })}
      <Icon data={checked ? mdiCheck : mdiClose} class="size-3" />
    {/snippet}
  </Switch>
</div>
