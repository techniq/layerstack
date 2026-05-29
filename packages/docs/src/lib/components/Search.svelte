<script lang="ts" module>
	import LucideSearch from '~icons/lucide/search';
	import LucideGlobe from '~icons/lucide/globe';
	import LucideBlocks from '~icons/lucide/blocks';
	import LucideParentheses from '~icons/lucide/parentheses';
	import LucideHash from '~icons/lucide/hash';
	import LucideFileText from '~icons/lucide/file-text';

	import type { SearchEntry } from '../search.js';

	type IconComponent = typeof LucideHash;
	export type SearchTypeConfig = {
		/** Icon shown for each entry `type` (fallback used for unknown types). */
		typeIcons?: Record<string, IconComponent>;
		/** Group order for sorting (lower = earlier). */
		groupOrder?: Record<string, number>;
		/** Group heading labels. */
		groupLabels?: Record<string, string>;
	};

	const DEFAULT_TYPE_ICONS: Record<string, IconComponent> = {
		page: LucideFileText,
		guide: LucideGlobe,
		component: LucideBlocks,
		reference: LucideBlocks,
		example: LucideBlocks,
		util: LucideParentheses,
		heading: LucideHash
	};
	const DEFAULT_GROUP_ORDER: Record<string, number> = {
		page: 0,
		guide: 1,
		component: 2,
		reference: 2,
		example: 3,
		util: 4
	};
	const DEFAULT_GROUP_LABELS: Record<string, string> = {
		page: 'Pages',
		guide: 'Guides',
		component: 'Components',
		reference: 'Reference',
		example: 'Examples',
		util: 'Utils'
	};
</script>

<script lang="ts">
	import { cls } from '@layerstack/tailwind';
	import { goto } from '$app/navigation';
	import { Button, Dialog, Kbd, MenuItem, SelectField, type MenuOption } from 'svelte-ux';

	import ExampleScreenshot from './ExampleScreenshot.svelte';

	type SearchOption = MenuOption<string> & { result: SearchEntry };

	let {
		hideInput = false,
		searchEndpoint = '/api/search.json',
		/** Render `ExampleScreenshot` previews for `example` results (requires generated screenshots). */
		showExampleScreenshots = false,
		/** Options shown when there is no query (e.g. quick links). */
		defaultOptions = [],
		typeIcons = DEFAULT_TYPE_ICONS,
		groupLabels = DEFAULT_GROUP_LABELS,
		groupOrder = DEFAULT_GROUP_ORDER
	}: {
		hideInput?: boolean;
		searchEndpoint?: string;
		showExampleScreenshots?: boolean;
		defaultOptions?: SearchOption[];
		typeIcons?: Record<string, IconComponent>;
		groupLabels?: Record<string, string>;
		groupOrder?: Record<string, number>;
	} = $props();

	let open = $state(false);
	let searchQuery = $state('');
	let selected = $state<string | null>(null);
	let searchIndexReady = $state(false);

	// Dynamically imported search function (to avoid bundling FlexSearch in the server build)
	let searchFn: ((query: string) => SearchEntry[]) | null = $state(null);

	$effect(() => {
		if (open && !searchIndexReady) {
			import('../search.js').then(async (mod) => {
				await mod.initSearch(searchEndpoint);
				searchFn = mod.search;
				searchIndexReady = true;
			});
		}
	});

	const searchResults = $derived.by((): SearchEntry[] => {
		if (!searchIndexReady || !searchQuery || !searchFn) return [];
		return searchFn(searchQuery);
	});

	/** Effective type for grouping (headings group under their parent's type). */
	function getGroupType(entry: SearchEntry): string {
		return entry.type === 'heading' && entry.parentType ? entry.parentType : entry.type;
	}

	function orderOf(type: string): number {
		return groupOrder[type] ?? 99;
	}

	function labelOf(type: string): string {
		return groupLabels[type] ?? type.charAt(0).toUpperCase() + type.slice(1);
	}

	/**
	 * Rank a result for "Best match". Every query token must appear in the haystack —
	 * built from author-curated fields only (title, plus component name and tags for
	 * examples) — so long-content pages aren't promoted just for body-text hits.
	 * 0 = prefix hit (strongest), 1 = contains, -1 = does not qualify.
	 */
	function bestMatchRank(result: SearchEntry, query: string): number {
		if (result.type === 'heading') return -1;
		const plainTitle = result.title.replace(/<[^>]*>/g, '').toLowerCase();
		const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
		if (!tokens.length) return -1;

		const haystackParts = [plainTitle];
		if (result.type === 'example') {
			if (result.component) haystackParts.push(result.component.toLowerCase());
			if (result.tags?.length) haystackParts.push(...result.tags.map((t) => t.toLowerCase()));
		}
		const haystack = haystackParts.join(' ');

		if (!tokens.every((t) => haystack.includes(t))) return -1;

		const haystackWords = haystack.split(/\s+/);
		const hasPrefixHit = tokens.some((t) => haystackWords.some((w) => w.startsWith(t)));
		return hasPrefixHit ? 0 : 1;
	}

	const options = $derived.by((): SearchOption[] => {
		if (!searchQuery) return defaultOptions;
		if (!searchResults.length) return [];

		const startsWithMatches: SearchEntry[] = [];
		const containsMatches: SearchEntry[] = [];
		const rest: SearchEntry[] = [];
		for (const result of searchResults) {
			const rank = bestMatchRank(result, searchQuery);
			if (rank === 0) startsWithMatches.push(result);
			else if (rank === 1) containsMatches.push(result);
			else rest.push(result);
		}

		function sortEntries(entries: SearchEntry[]) {
			return [...entries].sort((a, b) => {
				const aOrder = orderOf(getGroupType(a));
				const bOrder = orderOf(getGroupType(b));
				if (aOrder !== bOrder) return aOrder - bOrder;

				const aParentSlug = a.type === 'heading' ? a.parentSlug : a.slug;
				const bParentSlug = b.type === 'heading' ? b.parentSlug : b.slug;
				if (aParentSlug !== bParentSlug) {
					return (aParentSlug ?? '').localeCompare(bParentSlug ?? '');
				}

				if (a.type !== 'heading' && b.type === 'heading') return -1;
				if (a.type === 'heading' && b.type !== 'heading') return 1;
				return 0;
			});
		}

		const bestMatches = [...sortEntries(startsWithMatches), ...sortEntries(containsMatches)];
		const sorted = [...bestMatches, ...sortEntries(rest)];

		const seen = new Set<string>();
		const opts: SearchOption[] = [];
		for (const result of sorted) {
			if (seen.has(result.slug)) continue;
			seen.add(result.slug);
			const isBest = bestMatches.includes(result);
			opts.push({
				label: result.title,
				value: result.slug,
				group: isBest ? 'Best match' : labelOf(getGroupType(result)),
				result
			});
		}
		return opts;
	});

	function closeSearch() {
		open = false;
		searchQuery = '';
		selected = null;
	}

	function handleChange(e: CustomEvent<{ value: string | null | undefined }>) {
		const slug = e.detail.value;
		if (slug) {
			goto(`/${slug}`);
			closeSearch();
		}
	}

	function handleInputChange(e: CustomEvent<string>) {
		searchQuery = e.detail;
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = !open;
		}
	}
</script>

<svelte:window onkeydown={onKeyDown} />

{#if !hideInput}
	<Button
		icon={LucideSearch}
		onclick={() => (open = true)}
		class="sm:border sm:bg-surface-content/5 sm:hover:bg-surface-content/10 rounded-full sm:w-56 justify-start"
	>
		<span class="flex-1 text-left max-sm:hidden">Search</span>
		<Kbd variant="none" class="opacity-50 max-sm:hidden" command>K</Kbd>
	</Button>
{/if}

<Dialog
	bind:open
	classes={{
		root: 'items-start mt-8 sm:mt-24',
		backdrop: 'backdrop-blur-xs'
	}}
>
	<SelectField
		{options}
		bind:value={selected}
		on:change={handleChange}
		on:inputChange={handleInputChange}
		placeholder="Search for anything..."
		inlineOptions
		autofocus
		loading={!searchIndexReady && !searchQuery}
		clearSearchOnOpen={false}
		search={async (_text, options) => options}
		classes={{
			root: 'w-150 max-w-[95vw]',
			field: {
				container: 'border-none hover:shadow-none group-focus-within:shadow-none'
			},
			options: 'overflow-auto max-h-[min(70dvh,400px)] [scrollbar-width:thin] p-2!'
		}}
	>
		{#snippet prepend()}
			<LucideSearch class="text-surface-content/50 mr-2" />
		{/snippet}

		{#snippet option({
			option,
			index,
			highlightIndex
		}: {
			option: SearchOption;
			index: number;
			highlightIndex: number;
		})}
			{@const result = option.result}
			{@const isHighlighted = highlightIndex === index}
			{@const isHeading = result.type === 'heading'}
			<MenuItem
				scrollIntoView={{ condition: isHighlighted, onlyIfNeeded: true }}
				class={cls('p-3 rounded-md', isHighlighted && 'bg-surface-content/5')}
			>
				<div class="grid gap-4 grid-cols-[80px_1fr]">
					{#if showExampleScreenshots && result.type === 'example' && result.component && result.example}
						<ExampleScreenshot
							component={result.component}
							example={result.example}
							aspect="video"
							class="rounded border border-surface-content/10 bg-surface-100"
						/>
					{:else}
						{@const Icon = typeIcons[result.type] ?? LucideHash}
						<div
							class={cls(
								'rounded border border-surface-content/10 bg-surface-100 flex items-center justify-center',
								isHeading ? 'aspect-square w-1/2 justify-self-end' : 'aspect-video'
							)}
						>
							<Icon class="size-6 text-surface-content/30" />
						</div>
					{/if}
					<div class="flex-1 min-w-0">
						<p
							class={cls(
								'font-medium text-surface-content/90 m-0 truncate first-letter:capitalize',
								isHeading ? 'text-sm' : 'text-base'
							)}
						>
							{#if isHeading && result.parent}
								<span class="text-surface-content/50">{result.parent}</span>
								<span class="text-surface-content/30 mx-1">›</span>
							{/if}
							{@html result.title}
						</p>
						<p
							class={cls(
								'text-sm text-surface-content/60 m-0 mt-1 line-clamp-1',
								'[&_mark]:bg-transparent [&_mark]:text-surface-content [&_mark]:font-medium'
							)}
						>
							{@html result.content ?? ''}
						</p>
					</div>
				</div>
			</MenuItem>
		{/snippet}

		{#snippet empty()}
			{#if searchQuery && !searchResults.length}
				<div class="text-center py-8">
					<p class="text-surface-content/60 text-lg">No results found.</p>
				</div>
			{/if}
		{/snippet}
	</SelectField>
</Dialog>
