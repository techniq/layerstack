<script lang="ts">
  import { Switch } from '@layerstack/ui';

  let notifications = $state(true);
  let marketing = $state(false);
</script>

<div class="grid gap-3">
  <label class="flex items-center gap-3">
    <Switch bind:checked={notifications} />
    <span class="text-sm">Notifications ({notifications ? 'on' : 'off'})</span>
  </label>

  <label class="flex items-center gap-3">
    <Switch bind:checked={marketing} color="success" />
    <span class="text-sm">Marketing emails</span>
  </label>

  <div class="flex items-center gap-4">
    <Switch size="sm" checked />
    <Switch size="md" checked />
    <Switch size="lg" checked />
    <Switch checked disabled />
  </div>
</div>
