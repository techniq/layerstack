<script lang="ts">
	import { Duration, DurationUnits } from '@layerstack/utils';
</script>

<div>{new Duration({ start: '1982-03-30' }).format()}</div>
<div>{new Duration({ start: '2021-01-01', end: '2021-01-07' }).format()}</div>
<div>{new Duration({ start: '1982-03-30' }).format({ totalUnits: 2 })}</div>
<div>{new Duration({ start: '1982-03-30' }).format({ minUnits: DurationUnits.Hour })}</div>
