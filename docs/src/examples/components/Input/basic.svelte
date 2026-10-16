<script lang="ts">
  import { Input } from '@layerstack/ui';

  let value = $state('');
</script>

<div class="grid gap-2 max-w-sm">
  <Input bind:value placeholder="Unstyled input" class="border rounded-sm px-2 py-1" />
  <div class="text-sm text-surface-content/70">Value: <code>{value || '(empty)'}</code></div>
</div>
