<script lang="ts">
  import { Duration } from '@layerstack/utils';
</script>

<div>{new Duration({ duration: { milliseconds: 300 } }).format()}</div>
<div>{new Duration({ duration: { hours: 1, minutes: 30 } }).format()}</div>
<div>{new Duration({ duration: { days: 5, hours: 26 } }).format()}</div>
