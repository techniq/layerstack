<script lang="ts">
  import { Stack } from '@layerstack/ui';
</script>

<div class="grid gap-6">
  <div>
    <div class="text-xs text-surface-content/50 mb-1">horizontal</div>
    <Stack horizontal gap={8}>
      <div class="bg-surface-200 rounded-sm p-3">One</div>
      <div class="bg-surface-200 rounded-sm p-3">Two</div>
      <div class="bg-surface-200 rounded-sm p-3">Three</div>
    </Stack>
  </div>

  <div>
    <div class="text-xs text-surface-content/50 mb-1">vertical</div>
    <Stack vertical gap={8}>
      <div class="bg-surface-200 rounded-sm p-3">One</div>
      <div class="bg-surface-200 rounded-sm p-3">Two</div>
    </Stack>
  </div>

  <div>
    <div class="text-xs text-surface-content/50 mb-1">stack (overlaid, centered)</div>
    <Stack stack>
      <div class="bg-surface-200 rounded-sm size-24"></div>
      <div class="text-sm font-medium">Centered</div>
    </Stack>
  </div>
</div>
