<script lang="ts">
  import { longpress } from '@layerstack/svelte-actions';

  let longpressed = false;
</script>

<button
  class="border rounded-sm p-2 text-sm hover:bg-surface-content/5"
  use:longpress={1000}
  on:longpress={() => (longpressed = !longpressed)}
>
  Click and hold
</button>
{#if longpressed}
  <span class="text-xs text-surface-content/50">Success! Repeat to hide</span>
{/if}
