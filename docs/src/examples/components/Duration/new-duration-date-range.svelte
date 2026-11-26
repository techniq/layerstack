<script lang="ts">
  import { Duration } from '@layerstack/utils';
  import { intervalOffset } from '@layerstack/utils/date';
</script>

<div class="whitespace-pre">
  {JSON.stringify(new Duration({ start: intervalOffset('day', new Date(), 3) }), null, 2)}
</div>
