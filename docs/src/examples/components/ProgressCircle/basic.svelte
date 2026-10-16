<script lang="ts">
  import { ProgressCircle } from '@layerstack/ui';
</script>

<div class="flex items-center gap-6">
  <!-- No `value` renders an indeterminate spinner -->
  <ProgressCircle class="text-primary" />
  <ProgressCircle value={25} class="text-primary" />
  <ProgressCircle value={75} track class="text-primary" />
  <ProgressCircle value={100} track class="text-success" />
</div>
