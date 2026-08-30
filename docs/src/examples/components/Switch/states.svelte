<script lang="ts">
  import { Button, Switch } from '@layerstack/ui';

  let checked = $state<boolean | null>(null);
</script>

<div class="grid gap-4">
  <div class="flex gap-4 items-center">
    <Switch size="sm" checked />
    <Switch size="md" checked />
    <Switch size="lg" checked />
  </div>

  <div class="flex gap-4 items-center">
    {#each ['primary', 'secondary', 'accent', 'success', 'warning', 'danger'] as const as color (color)}
      <Switch {color} checked />
    {/each}
  </div>

  <div class="flex gap-4 items-center">
    <Switch disabled />
    <Switch disabled checked />
  </div>

  <!-- `null` is a third, indeterminate state -->
  <div class="flex gap-2 items-center">
    <Switch bind:checked />
    <span class="text-sm text-surface-content/70">checked: {String(checked)}</span>
    <Button size="sm" onclick={() => (checked = null)}>Reset to null</Button>
  </div>
</div>
