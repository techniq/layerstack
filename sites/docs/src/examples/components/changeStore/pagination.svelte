<script lang="ts">
	import { Pagination } from 'svelte-ux';
	import { changeStore, paginationStore } from '@layerstack/svelte-stores';

	const pagination = paginationStore({ total: 500 });
	const paginationChanged = changeStore(pagination, (value) =>
		console.log('pagination changed', value)
	);
</script>

<Pagination {pagination} />
<pre>{JSON.stringify($paginationChanged, null, 2)}</pre>
