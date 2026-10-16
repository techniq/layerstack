<script lang="ts">
  import { Icon } from '@layerstack/ui';
  import { mdiHome } from '@mdi/js';

  // Two overlapping paths, styled individually via `classes.path`
  const paths = ['M12 2L2 7l10 5 10-5-10-5z', 'M2 17l10 5 10-5M2 12l10 5 10-5'];
</script>

<div class="flex items-center gap-4 text-3xl">
  <Icon data={mdiHome} class="text-primary" />
  <Icon path={paths} classes={{ path: ['text-primary', 'text-surface-content/40'] }} />
</div>
