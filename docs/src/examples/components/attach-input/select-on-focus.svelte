<script lang="ts">
  import { selectOnFocus } from '@layerstack/svelte-attachments';
</script>

<input value="Example text" {@attach selectOnFocus()} class="border" />
