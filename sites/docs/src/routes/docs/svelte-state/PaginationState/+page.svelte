<script lang="ts">
  import Code from '$docs/Code.svelte';
  import Preview from '$docs/Preview.svelte';

  import { PaginationState } from '$svelte-state/paginationState.svelte.js';
</script>

<h1>Usage</h1>

<Code
  source={`import { PaginationState } from '@layerstack/svelte-state';

const state = new PaginationState({ total: 100 });

state.page
state.perPage
state.total
state.totalPages
state.from
state.to
state.isFirst
state.isLast
state.hasPrevious
state.hasNext
state.slice(data)
`}
  language="javascript"
/>
