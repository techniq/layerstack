<script lang="ts">
  import { autoHeight } from '@layerstack/svelte-attachments';
</script>

<textarea value="Example text" {@attach autoHeight()} class="border"></textarea>
