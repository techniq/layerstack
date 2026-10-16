<script lang="ts">
  import { debounceEvent } from '@layerstack/svelte-attachments';

  let lastValue = $state('');
</script>

<input
  value="Example text"
  {@attach debounceEvent({
    type: 'input',
    listener: (e) => {
      lastValue = (e.target as HTMLInputElement).value;
    },
    timeout: 1000,
  })}
  class="border"
/>

<div class="mt-2 text-sm text-surface-content/70">
  Debounced value: <span class="font-mono">{lastValue}</span>
</div>
