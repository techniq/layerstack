<script lang="ts">
  import { ProgressCircle } from '@layerstack/ui';
</script>

<!-- The stroke follows `currentColor`; the track has its own `--track-color` -->
<div class="flex gap-4 items-center">
  <ProgressCircle value={70} track class="text-primary" />
  <ProgressCircle value={70} track class="text-success" />
  <ProgressCircle value={70} track class="text-warning" />
  <ProgressCircle value={70} track class="text-danger [--track-color:var(--color-danger)]/20" />
</div>
