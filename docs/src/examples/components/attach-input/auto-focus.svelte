<script lang="ts">
  import { autoFocus } from '@layerstack/svelte-attachments';
</script>

<input value="Example text" {@attach autoFocus()} class="border" />
