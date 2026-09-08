<script lang="ts">
  import { Progress } from '@layerstack/ui';
</script>

<!-- `--color` styles the bar, `--track-color` the groove behind it -->
<div class="grid gap-3">
  <Progress value={0.5} class="[--color:var(--color-success)]" />
  <Progress value={0.7} class="[--color:var(--color-warning)]" />
  <Progress value={0.9} class="[--color:var(--color-danger)]" />

  <Progress
    value={0.5}
    class="[--color:var(--color-primary)] [--track-color:var(--color-primary)]/10"
  />
  <Progress
    value={0.9}
    class="[--color:var(--color-danger)] [--track-color:var(--color-danger)]/10"
  />
</div>
