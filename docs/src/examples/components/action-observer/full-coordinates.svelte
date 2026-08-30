<script lang="ts">
  import { resize } from '@layerstack/svelte-actions';
</script>

<div
  use:resize
  on:resize={(e) => {
    // @ts-expect-error
    e.target.innerText = JSON.stringify(e.target.getBoundingClientRect(), null, 2);
  }}
  class="resize overflow-auto whitespace-pre outline rounded-sm"
></div>
