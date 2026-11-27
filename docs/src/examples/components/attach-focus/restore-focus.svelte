<script lang="ts">
  import { focusMove } from '@layerstack/svelte-attachments';

  let restoreFocus = $state(true);
  let delay = $state(0);
  let open = $state(false);
</script>

<div class="grid gap-2 mb-4">
  <label class="flex items-center gap-2">
    <input type="checkbox" bind:checked={restoreFocus} />
    Restore focus on close
  </label>

  <label class="flex items-center gap-2">
    Delay
    <input type="range" bind:value={delay} max={1000} step={50} />
    <span class="tabular-nums">{delay}ms</span>
  </label>
</div>

<button class="border rounded-sm px-2 py-1" onclick={() => (open = !open)}>
  {open ? 'Close' : 'Open'} panel
</button>

{#if open}
  <!-- re-mount when options change so the attachment picks them up -->
  {#key `${restoreFocus}-${delay}`}
    <div
      class="mt-2 border rounded-sm p-4 outline-hidden focus-visible:ring-1 ring-surface-content/60"
      {@attach focusMove({ restoreFocus, delay })}
    >
      Focused after {delay}ms.
    </div>
  {/key}
{/if}
