<script lang="ts">
  import { blurOnEscape } from '@layerstack/svelte-actions';
</script>

<input value="Example text" use:blurOnEscape class="border" />
