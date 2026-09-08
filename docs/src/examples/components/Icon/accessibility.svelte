<script lang="ts">
  import { Icon } from '@layerstack/ui';
  import { mdiHome } from '@mdi/js';
</script>

<!-- Without `title`/`desc` the icon is `role="presentation"` and hidden from screen readers -->
<div class="flex items-center gap-4 text-2xl">
  <Icon data={mdiHome} />
  <Icon data={mdiHome} title="Home" />
  <Icon data={mdiHome} title="Home" desc="Return to the dashboard" />
</div>
