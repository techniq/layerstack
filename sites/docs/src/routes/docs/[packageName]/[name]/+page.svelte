<script lang="ts">
	import { examples } from '@layerstack/docs/context';
	import { TableOfContents, OpenWithButton } from '@layerstack/docs/components';
	import { cls } from '@layerstack/tailwind';
	import { page } from '$app/state';

	import IconAlignLeft from '~icons/lucide/align-left';
	import IconChevronRight from '~icons/lucide/chevron-right';

	const pkg = {
		name: 'LayerStack',
		url: 'https://github.com/techniq/layerstack',
		description: 'A collection of Svelte actions, stores, state, and general utilities'
	};

	let { data } = $props();

	const metadata = $derived(data.metadata);
	const PageComponent = $derived(data.PageComponent);

	// Provide loaded examples to <Example> components rendered within the markdown
	examples.set({
		get current() {
			return data.examples;
		}
	});
</script>

<div class="px-5">
	<div
		class="[@media(min-height:900px)]:sticky top-[var(--headerHeight)] z-60 bg-surface-200/90 backdrop-blur-sm py-4 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)calc(100%-4px),rgba(0,0,0,0))]"
	>
		<div class="flex items-center gap-1">
			<span class="text-xs font-bold text-surface-content/50 capitalize">Docs</span>
			<IconChevronRight class="text-surface-content/25 size-3" />
			<span class="text-xs font-bold text-primary">{page.params.packageName}</span>
		</div>

		<div class="text-2xl font-bold">
			{metadata.name}
			{#if metadata.status}
				<span
					class={cls(
						'text-sm px-2 rounded-sm align-middle',
						metadata.status === 'beta' && 'bg-yellow-500/20 text-yellow-800',
						metadata.status === 'deprecated' && 'bg-danger/20 text-danger-900'
					)}
				>
					{metadata.status}
				</span>
			{/if}
		</div>

		{#if metadata.description}
			<div class="text-sm text-surface-content/60 whitespace-pre-line xl:pr-[240px]">
				{metadata.description}
			</div>
		{/if}

		<div class="flex gap-2 mt-3">
			<OpenWithButton {metadata} {pkg} />
		</div>
	</div>

	<div class="grid xl:grid-cols-[1fr_auto] gap-6 pb-4">
		<main class="overflow-auto p-1">
			{#if metadata.features?.length}
				<h2 id="features" class="text-2xl font-semibold mt-8 mb-1">Features</h2>
				<ul class="grid gap-1 list-disc pl-6 text-surface-content">
					{#each metadata.features as feature}
						<li>{@html feature}</li>
					{/each}
				</ul>
			{/if}

			{#key page.url.pathname}
				<PageComponent />
			{/key}
		</main>

		{#if !metadata.hideTableOfContents && metadata.toc?.length}
			<div
				class="w-[224px] hidden xl:block sticky top-[calc(var(--headerHeight)+10px)] pr-2 max-h-[calc(100dvh-64px)] overflow-auto"
			>
				<div
					class="flex gap-2 items-center text-xs font-medium uppercase pb-3 tracking-widest text-surface-content/50"
				>
					<IconAlignLeft />
					On this page
				</div>
				{#key page.url.pathname}
					<TableOfContents items={metadata.toc} scrollOffset={184} />
				{/key}
			</div>
		{/if}
	</div>
</div>
