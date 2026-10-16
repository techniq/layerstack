<script lang="ts">
  import { TextField } from '@layerstack/ui';

  let immediate = $state(0);
  let debounced = $state(0);
</script>

<div class="grid gap-4 max-w-sm">
  <TextField label="Every keystroke" onChange={() => immediate++} />
  <TextField label="Debounced 500ms" debounceChange={500} onChange={() => debounced++} />
</div>

<div class="mt-3 text-sm text-surface-content/70">
  onChange calls — immediate: {immediate}, debounced: {debounced}
</div>
