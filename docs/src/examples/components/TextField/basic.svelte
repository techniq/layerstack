<script lang="ts">
  import { TextField } from '@layerstack/ui';

  let value = $state('');
</script>

<div class="grid gap-4 max-w-sm">
  <TextField label="Name" bind:value />
  <div class="text-sm text-surface-content/70">Value: <code>{value ?? 'null'}</code></div>
</div>
