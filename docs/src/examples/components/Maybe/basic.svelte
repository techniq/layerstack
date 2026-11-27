<script lang="ts">
  import { Card, Maybe } from '@layerstack/ui';

  let wrapped = $state(true);
</script>

<label class="flex items-center gap-2 mb-3">
  <input type="checkbox" bind:checked={wrapped} /> Wrap in a Card
</label>

<!-- `this` conditionally wraps the children, without duplicating them in an {#if} -->
<Maybe this={wrapped ? Card : null} title="Wrapped">
  <div class="p-4 text-sm text-surface-content/70">Always rendered</div>
</Maybe>
