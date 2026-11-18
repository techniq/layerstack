<script lang="ts">
  import { Avatar } from '@layerstack/ui';
  import { mdiAccount } from '@mdi/js';
</script>

<div class="flex items-center gap-4">
  <Avatar size="sm" class="bg-primary text-primary-content">AB</Avatar>
  <Avatar size="md" class="bg-secondary text-secondary-content">CD</Avatar>
  <Avatar size="lg" class="bg-surface-200" icon={mdiAccount} />
</div>
