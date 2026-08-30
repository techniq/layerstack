<script lang="ts">
  import { Icon } from '@layerstack/ui';

  import IconHouse from '~icons/lucide/house';
  import IconSettings from '~icons/lucide/settings';
</script>

<!-- `data` also accepts an icon component (lucide, unplugin-icons, ...) -->
<div class="flex items-center gap-4 text-2xl">
  <Icon data={IconHouse} />
  <Icon data={IconSettings} />
</div>
