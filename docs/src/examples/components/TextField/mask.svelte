<script lang="ts">
  import { TextField } from '@layerstack/ui';

  let phone = $state('');
</script>

<div class="grid gap-4 max-w-sm">
  <TextField label="Phone" mask="(___) ___-____" bind:value={phone} />
  <div class="text-sm text-surface-content/70">Value: <code>{phone || '(empty)'}</code></div>
</div>
