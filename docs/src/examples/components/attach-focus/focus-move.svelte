<script lang="ts">
  import { focusMove } from '@layerstack/svelte-attachments';

  let open = $state(false);
</script>

<button class="border rounded-sm px-2 py-1" onclick={() => (open = !open)}>
  {open ? 'Close' : 'Open'} panel
</button>

{#if open}
  <!-- Panel receives focus on mount, and returns it to the button on unmount -->
  <div
    class="mt-2 border rounded-sm p-4 outline-hidden focus-visible:ring-1 ring-surface-content/60"
    {@attach focusMove({ restoreFocus: true })}
  >
    This panel was focused programmatically. Close it to restore focus to the button.
  </div>
{/if}
