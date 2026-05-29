<script lang="ts">
	import { Duration } from '@layerstack/utils';
	import { intervalOffset } from '@layerstack/utils/date';
</script>

<div>{new Duration({ start: intervalOffset('day', new Date(), 3) }).format()}</div>
<div>{new Duration({ start: intervalOffset('month', new Date(), 3) }).format()}</div>
<div>
	{new Duration({ start: intervalOffset('month', new Date(), 3) }).format({ variant: 'long' })}
</div>
