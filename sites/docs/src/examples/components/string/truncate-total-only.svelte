<script lang="ts">
	import { truncate } from '@layerstack/utils';

	let str = 'This is very long text that will be truncated';
</script>

<div>{truncate(str, 20)}</div>
