<script lang="ts">
  import { Avatar, Icon } from '@layerstack/ui';
  import { mdiAccount } from '@mdi/js';
</script>

<div class="grid gap-4">
  <div class="flex gap-3 items-center">
    {#each ['sm', 'md', 'lg'] as const as size (size)}
      <Avatar {size} class="bg-primary text-primary-content font-bold">{size}</Avatar>
    {/each}
  </div>

  <div class="flex gap-3 items-center">
    <Avatar class="bg-primary text-primary-content font-bold">A</Avatar>
    <Avatar class="bg-success text-success-content font-bold">B</Avatar>
    <Avatar class="border border-surface-content/20">C</Avatar>

    <!-- Icon as a prop, or as children for full control -->
    <Avatar icon={mdiAccount} class="bg-primary text-primary-content" />
    <Avatar class="bg-secondary">
      <Icon data={mdiAccount} class="text-secondary-content" />
    </Avatar>
  </div>
</div>
