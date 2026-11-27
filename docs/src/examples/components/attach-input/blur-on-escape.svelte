<script lang="ts">
  import { blurOnEscape } from '@layerstack/svelte-attachments';
</script>

<input value="Example text" {@attach blurOnEscape()} class="border" />
