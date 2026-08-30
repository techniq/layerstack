<script lang="ts">
  import { Field } from '@layerstack/ui';

  let value = $state<string | null>('Clear me');
</script>

<div class="grid gap-4 max-w-sm">
  <Field label="Clearable" bind:value clearable onClear={() => console.log('cleared')} />
  <div class="text-sm text-surface-content/70">Value: <code>{value ?? 'null'}</code></div>
</div>
