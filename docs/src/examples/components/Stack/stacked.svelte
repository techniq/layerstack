<script lang="ts">
  import { Button, Icon, Stack } from '@layerstack/ui';
  import { mdiClose } from '@mdi/js';
</script>

<!-- `stack` puts every child in the same cell, which is how corner overlays are built -->
<div class="flex gap-6">
  <Stack stack class="w-40 h-24 border border-surface-content/10 rounded">
    <div class="place-self-center text-sm text-surface-content/70">Content</div>
    <Button icon={mdiClose} size="sm" class="place-self-start justify-self-end m-1" />
  </Stack>

  <Stack stack class="w-40 h-24 border border-surface-content/10 rounded">
    <div class="place-self-center text-sm text-surface-content/70">Content</div>
    <Icon data={mdiClose} class="place-self-end justify-self-start m-2 text-surface-content/30" />
  </Stack>
</div>
