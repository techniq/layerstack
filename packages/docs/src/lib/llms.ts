/**
 * Helpers for generating LLM-optimized (`llms.txt`) markdown from docs content.
 *
 * These are pure/string utilities — the consuming docs app supplies the data
 * (via `content-collections` + `import.meta.glob`) and assembles the endpoints.
 */
import type { ComponentAPI } from './api-types.js';

/** Create a `text/markdown` response for an llms.txt endpoint. */
export function markdownResponse(content: string, filename: string): Response {
	return new Response(content, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			'Content-Disposition': `inline; filename="${filename}"`
		}
	});
}

/** Strip `<script module>` blocks and the `export { data }` statement from example source. */
export function trimCode(code: string): string {
	return code
		.replace(/<script\s+module>[\s\S]*?<\/script>\n*/g, '')
		.replace(/\n*\s*export \{ data \};\s*\n*\s*<\/script>/gm, '\n</script>')
		.trim();
}

function escapeMarkdown(text: string): string {
	return text
		.replace(/\|/g, '\\|')
		.replace(/\n/g, ' ')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

/** Generate a markdown API table from a component's `ComponentAPI` properties. */
export function generateApiTable(api: ComponentAPI): string {
	if (!api.properties || api.properties.length === 0) return '';

	const rows = api.properties.map((prop) => {
		const name = prop.required ? `**${prop.name}** (required)` : prop.name;
		const type = `\`${escapeMarkdown(prop.type)}\``;
		const defaultVal = prop.default ? `\`${escapeMarkdown(prop.default)}\`` : '-';
		const description = prop.description ? escapeMarkdown(prop.description) : '-';
		return `| ${name} | ${type} | ${defaultVal} | ${description} |`;
	});

	return `| Property | Type | Default | Description |
|----------|------|---------|-------------|
${rows.join('\n')}`;
}

/** Resolve the raw source for an example, by component (optional) + name. */
export type ExampleSourceResolver = (component: string | undefined, name: string) => string | undefined;

/** Build a docs URL for a (cross-component) example reference. */
export type ExampleUrlResolver = (component: string, name: string) => string;

/**
 * Replace `:example{...}` directives with inlined fenced code blocks, using a
 * caller-provided source resolver. Run this BEFORE `processMarkdownContent`.
 *
 * When an example's source can't be resolved, the directive becomes a "See example"
 * reference — a markdown link if `exampleUrl` is provided, otherwise plain text.
 */
export function inlineExampleDirectives(
	content: string,
	resolveSource: ExampleSourceResolver,
	defaultComponent?: string,
	exampleUrl?: ExampleUrlResolver
): string {
	// Strip HTML comments first so commented-out examples aren't inlined
	content = content.replace(/<!--[\s\S]*?-->/g, '');

	// Cross-component examples: :example{ component="X" name="Y" ... } (run first)
	content = content.replace(
		/:example\{\s*component="([^"]+)"\s+name="([^"]+)"[^}]*\}/g,
		(_match, component: string, name: string) => {
			const raw = resolveSource(component, name);
			if (raw) return '```svelte\n' + trimCode(raw) + '\n```';
			return exampleUrl
				? `See example: [${component}/${name}](${exampleUrl(component, name)})`
				: `See example: ${component}/${name}`;
		}
	);

	// Same-component examples: :example{ name="Y" ... }
	content = content.replace(/:example\{\s*name="([^"]+)"[^}]*\}/g, (_match, name: string) => {
		const raw = resolveSource(defaultComponent, name);
		return raw ? '```svelte\n' + trimCode(raw) + '\n```' : `See example: ${name}`;
	});

	return content;
}

/**
 * Convert docs markdown (with Svelte + MDC directive syntax) to vanilla markdown
 * suitable for LLM consumption.
 */
export function processMarkdownContent(
	content: string,
	options?: { exampleUrl?: ExampleUrlResolver }
): string {
	// Remove frontmatter
	content = content.replace(/^---\n[\s\S]*?\n---\n*/, '');

	// Remove HTML comments
	content = content.replace(/<!--[\s\S]*?-->/g, '');

	// Remove Svelte script blocks and components ONLY outside of code blocks
	content = content
		.split(/(```[\s\S]*?```)/g)
		.map((part, index) => {
			if (index % 2 === 1) return part; // code block — leave as-is
			part = part.replace(/<script[^>]*>[\s\S]*?<\/script>\n*/g, '');
			part = part.replace(/<[A-Z][a-zA-Z]*[^>]*\/>\n*/g, '');
			part = part.replace(/<[A-Z][a-zA-Z]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>\n*/g, '');
			return part;
		})
		.join('');

	// Surface code-block `title="..."` meta as a "File:" line
	content = content.replace(/(```\w*)\s+([^\n]*title="[^"]+")[^\n]*$/gm, (_, lang, meta) => {
		const titleMatch = meta.match(/title="([^"]+)"/);
		return titleMatch ? `File: ${titleMatch[1]} ${lang}` : lang;
	});

	// :::tabs → markdown table
	content = content.replace(
		/:::tabs\{key="([^"]+)"\}\s*([\s\S]*?)(?=\n:::(?:\s*$|\s*\n))\n:::/gm,
		(_, key, tabsContent) => {
			const tabs: { label: string; content: string }[] = [];
			const tabRegex =
				/::tab\{label="([^"]+)"[^}]*\}\s*([\s\S]*?)\s*(?=\n\s*::(?:\s*$|\s+))\n\s*::/gm;
			let match;
			while ((match = tabRegex.exec(tabsContent)) !== null) {
				tabs.push({ label: match[1], content: match[2].trim() });
			}
			if (tabs.length === 0) return '';

			const header = key.charAt(0).toUpperCase() + key.slice(1);
			let table = `| ${header} | Details |\n|-----------|---------|`;
			for (const tab of tabs) {
				const cleanContent = tab.content
					.replace(/:button\{label="([^"]+)"\s+href="([^"]+)"[^}]*\}/g, '[$1]($2)')
					.replace(/```\w*\n([\s\S]*?)```/g, '$1')
					.replace(/\n/g, ' ')
					.trim();
				table += `\n| ${tab.label} | ${cleanContent} |`;
			}
			return table;
		}
	);

	// ::note / ::tip / ::warning / ::caution → blockquote
	content = content.replace(
		/:{2,3}(note|tip|warning|caution)\s*([\s\S]*?)(?=\n:{2,3}(?:\s*$|\s*\n))\n:{2,3}/gm,
		(_, variant, noteContent) => `> ${variant}: ${noteContent.trim()}\n`
	);

	// ::steps → numbered list (## headings become numbered items)
	content = content.replace(
		/::steps\s*([\s\S]*?)(?=\n::(?:\s*$|\s*\n))\n::/gm,
		(_, stepsContent: string) => {
			let stepNum = 0;
			return stepsContent.replace(/^## (.+)$/gm, (_match: string, heading: string) => {
				stepNum++;
				return `**${stepNum}. ${heading}**`;
			});
		}
	);

	// Remove any remaining standalone ::
	content = content.replace(/^::\s*$/gm, '');

	// :icon syntax — keep bracketed label text, otherwise drop
	content = content.replace(/\[:icon\{[^}]+\}\s*([^\]]+)\]/g, '$1');
	content = content.replace(/:icon\{[^}]+\}\s*/g, '');

	// Any remaining :example directives → "See example" reference (link if a URL resolver is provided)
	content = content.replace(
		/:example\{\s*component="([^"]+)"\s+name="([^"]+)"[^}]*\}/g,
		(_match, component: string, name: string) =>
			options?.exampleUrl
				? `See example: [${component}/${name}](${options.exampleUrl(component, name)})`
				: `See example: ${component}/${name}`
	);
	content = content.replace(/:example\{\s*name="([^"]+)"[^}]*\}/g, 'See example: $1');

	// Collapse blank lines
	content = content.replace(/\n{3,}/g, '\n\n');

	return content.trim();
}

/**
 * Extract a `title` from a markdown file's frontmatter, falling back to `fallback`
 * (e.g. a title-cased filename) when absent.
 */
export function extractFrontmatterTitle(raw: string, fallback = ''): string {
	const frontmatter = raw.match(/^---\n([\s\S]*?)\n---/);
	const titleMatch = frontmatter?.[1].match(/^title:\s*(.+)$/m);
	if (titleMatch) return titleMatch[1].trim().replace(/^["']|["']$/g, '');
	return fallback;
}

/**
 * Generate LLM-optimized markdown for a guide from its raw source.
 *
 * The consuming app resolves the raw markdown (via `import.meta.glob`); this handles
 * the title (explicit → frontmatter → `fallbackTitle`) and content processing.
 */
export function generateGuideMarkdown(
	raw: string,
	options: { title?: string; fallbackTitle?: string } = {}
): string {
	const title = options.title ?? extractFrontmatterTitle(raw, options.fallbackTitle ?? '');
	const body = processMarkdownContent(raw);
	return title ? `# ${title}\n\n${body}` : body;
}

/** Minimal shape a doc needs to render reference markdown. */
export interface ReferenceDoc {
	name: string;
	slug: string;
	description?: string | null;
	content?: string | null;
	related?: string[] | null;
}

export interface ReferenceMarkdownOptions {
	/** Heading level for the title (1 = `#`). Related/extra sections use `headingLevel + 1`. Default: 1 */
	headingLevel?: number;
	/** Inline `:example` directives as fenced code blocks (requires `resolveSource`). Default: false */
	inlineExamples?: boolean;
	/** Resolver for example source (used when `inlineExamples`). */
	resolveSource?: ExampleSourceResolver;
	/** URL resolver for non-inlined cross-component `:example` references. */
	exampleUrl?: ExampleUrlResolver;
	/** Default component for same-component `:example{name}` directives (e.g. the doc's slug). */
	defaultComponent?: string;
	/** Sections inserted after the description, before the processed content (e.g. metadata). */
	leadingSections?: (string | null | undefined)[];
	/** Sections inserted after the processed content, before Related (e.g. API, Examples). */
	extraSections?: (string | null | undefined)[];
	/** Render Related items as links via this URL builder; omit for a plain `- name` list. */
	relatedUrl?: (name: string) => string;
}

/**
 * Generate LLM-optimized markdown for a reference doc (component/util/etc.):
 * `title → description → [leading] → content → [extra] → Related`.
 *
 * App-specific sections (metadata, API tables, example listings) are passed via
 * `leadingSections` / `extraSections` so the orchestration stays shared.
 */
export function generateReferenceMarkdown(
	doc: ReferenceDoc,
	options: ReferenceMarkdownOptions = {}
): string {
	const {
		headingLevel = 1,
		inlineExamples = false,
		resolveSource,
		exampleUrl,
		defaultComponent,
		leadingSections = [],
		extraSections = [],
		relatedUrl
	} = options;
	const h = (level: number) => '#'.repeat(level);

	const sections: string[] = [`${h(headingLevel)} ${doc.name}`];
	if (doc.description) sections.push(doc.description);

	for (const section of leadingSections) {
		if (section) sections.push(section);
	}

	if (doc.content) {
		let content = doc.content;
		if (inlineExamples && resolveSource) {
			content = inlineExampleDirectives(content, resolveSource, defaultComponent, exampleUrl);
		}
		const processed = processMarkdownContent(content, { exampleUrl });
		if (processed) sections.push(processed);
	}

	for (const section of extraSections) {
		if (section) sections.push(section);
	}

	if (doc.related?.length) {
		sections.push(`${h(headingLevel + 1)} Related`);
		sections.push(
			doc.related.map((r) => (relatedUrl ? `- [${r}](${relatedUrl(r)})` : `- ${r}`)).join('\n')
		);
	}

	return sections.join('\n\n');
}

/** An item in a markdown link list. */
export interface LinkListItem {
	name: string;
	url: string;
	description?: string | null;
}

/** Render a `## Title` section with a bulleted list of links: `- [name](url): description`. */
export function linkListSection(
	title: string,
	items: LinkListItem[],
	options: { headingLevel?: number } = {}
): string {
	const h = '#'.repeat(options.headingLevel ?? 2);
	const lines = items.map(
		(item) => `- [${item.name}](${item.url})${item.description ? `: ${item.description}` : ''}`
	);
	return `${h} ${title}\n\n${lines.join('\n')}`;
}

/**
 * Group docs by a segment of their slug (default: the first, i.e. the package),
 * sorted by key. Pass `sort` (e.g. `sortCollection`) to order within each group.
 */
export function groupBySlugSegment<T extends { slug: string }>(
	docs: T[],
	options: { segment?: number; sort?: (group: T[]) => T[] } = {}
): [string, T[]][] {
	const segment = options.segment ?? 0;
	const byKey = new Map<string, T[]>();
	for (const doc of docs) {
		const key = doc.slug.split('/')[segment];
		if (!byKey.has(key)) byKey.set(key, []);
		byKey.get(key)!.push(doc);
	}
	return [...byKey.entries()]
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([key, group]) => [key, options.sort ? options.sort(group) : group]);
}
