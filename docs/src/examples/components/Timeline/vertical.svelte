<script lang="ts">
  import { Timeline, TimelineEvent } from '@layerstack/ui';
  import { mdiCheckCircle, mdiClockOutline } from '@mdi/js';

  const data = [
    { start: '09:00', end: 'Standup', completed: true },
    { start: '11:00', end: 'Review', completed: true },
    { start: '14:00', end: 'Deploy' },
  ];
</script>

<div class="grid grid-cols-2 gap-8">
  <div>
    <div class="text-xs uppercase text-surface-content/50 mb-2">Vertical</div>
    <Timeline {data} vertical icon={mdiCheckCircle} />
  </div>

  <div>
    <div class="text-xs uppercase text-surface-content/50 mb-2">Compact, composed</div>
    <!-- `compact` puts the line to one side, with every value on the other -->
    <Timeline vertical compact>
      <TimelineEvent start="09:00" end="Standup" icon={mdiCheckCircle} completed />
      <TimelineEvent start="11:00" end="Review" icon={mdiCheckCircle} completed />
      <TimelineEvent start="14:00" icon={mdiClockOutline}>
        {#snippet endSnippet()}
          <span class="text-sm font-semibold text-warning">Deploy (pending)</span>
        {/snippet}
      </TimelineEvent>
    </Timeline>
  </div>
</div>
