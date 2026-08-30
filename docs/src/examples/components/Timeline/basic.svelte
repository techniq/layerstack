<script lang="ts">
  import { Timeline } from '@layerstack/ui';

  const data = [
    { start: 'Created', completed: true },
    { start: 'Reviewed', completed: true },
    { start: 'Merged' },
    { start: 'Released' },
  ];
</script>

<div class="grid gap-8">
  <Timeline {data} class="w-full" />
  <Timeline {data} vertical />
</div>
