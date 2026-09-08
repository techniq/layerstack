<script lang="ts">
  import { ErrorNotification } from '@layerstack/ui';
</script>

<div class="max-w-lg">
  <ErrorNotification
    title="Request failed"
    description={'Could not save your changes.\nPlease try again.'}
    message="TypeError: Cannot read properties of undefined"
    stackTrace={'at save (app.js:42)\nat onClick (Button.svelte:11)'}
  />
</div>
