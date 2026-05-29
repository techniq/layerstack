<script lang="ts">
	import { Duration } from '@layerstack/utils';
</script>

<div>{new Duration({ start: new Date('2023-02-28'), end: new Date('2023-03-01') }).format()}</div>
<div>{new Duration({ start: new Date('2024-02-28'), end: new Date('2024-03-01') }).format()}</div>
