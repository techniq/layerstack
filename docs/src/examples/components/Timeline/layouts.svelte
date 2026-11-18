<script lang="ts">
  import { Timeline } from '@layerstack/ui';
  import { mdiCheckCircle } from '@mdi/js';

  const data = [
    { start: '1976', end: 'Apple I', completed: true },
    { start: '1984', end: 'Macintosh', completed: true },
    { start: '2007', end: 'iPhone', completed: true },
    { start: '2015', end: 'Apple Watch' },
  ];

  // Values on both sides alternate the events across the line
  const alternating = [
    { start: '1976', end: 'Apple I', completed: true },
    { start: 'Macintosh', end: '1984', completed: true },
    { start: '2007', end: 'iPhone' },
  ];

  const classes = {
    event: {
      start: 'border border-surface-content/10 rounded text-sm p-2',
      end: 'border border-surface-content/10 rounded text-sm p-2',
      icon: 'size-5',
    },
  };
</script>

<div class="grid gap-8">
  <div>
    <div class="text-xs uppercase text-surface-content/50 mb-2">Horizontal, with icons</div>
    <Timeline {data} icon={mdiCheckCircle} {classes} />
  </div>

  <div>
    <div class="text-xs uppercase text-surface-content/50 mb-2">
      Alternating sides, snapped point
    </div>
    <Timeline data={alternating} icon={mdiCheckCircle} snapPoint {classes} />
  </div>
</div>
