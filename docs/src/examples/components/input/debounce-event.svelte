<script lang="ts">
  import { debounceEvent } from '@layerstack/svelte-actions';
</script>

<input
  value="Example text"
  use:debounceEvent={{
    type: 'input',
    listener: (e) => {
      // @ts-expect-error
      console.log(e.target.value);
    },
    timeout: 1000,
  }}
  class="border"
/>
