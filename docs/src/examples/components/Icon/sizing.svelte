<script lang="ts">
  import { Icon } from '@layerstack/ui';
  import { mdiHome } from '@mdi/js';
</script>

<!-- `size` defaults to `1.2em`, so icons scale with the surrounding text -->
<div class="flex items-end gap-4">
  <span class="text-sm">sm <Icon data={mdiHome} /></span>
  <span class="text-lg">lg <Icon data={mdiHome} /></span>
  <span class="text-3xl">3xl <Icon data={mdiHome} /></span>
</div>

<div class="flex items-end gap-4 mt-4">
  <Icon data={mdiHome} size="1rem" />
  <Icon data={mdiHome} size="2rem" />
  <Icon data={mdiHome} width="3rem" height="1rem" />
</div>
