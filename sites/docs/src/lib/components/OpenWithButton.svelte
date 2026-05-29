<script lang="ts">
	// Thin adapter around the shared `@layerstack/docs` component, injecting the
	// LayerStack project metadata so call sites (and markdown guides) can use
	// `<OpenWithButton {metadata} />` / `<OpenWithButton example />` directly.
	import { OpenWithButton } from '@layerstack/docs/components';

	let { metadata = {}, example = false } = $props();

	const pkg = {
		name: 'LayerStack',
		url: 'https://github.com/techniq/layerstack',
		description: 'A collection of Svelte actions, stores, state, and general utilities for Svelte'
	};
</script>

<OpenWithButton {metadata} {example} {pkg} />
