import { allReferences, allGuides, type Reference } from 'content-collections';
import { sortCollection } from '@layerstack/docs/collections';
import {
	inlineExampleDirectives,
	processMarkdownContent,
	type ExampleSourceResolver
} from '@layerstack/docs/llms';

const exampleSources = import.meta.glob<string>('/src/examples/**/*.svelte', {
	eager: true,
	query: '?raw',
	import: 'default'
});

const guideSources = import.meta.glob<string>('/src/content/guides/**/*.md', {
	eager: true,
	query: '?raw',
	import: 'default'
});

const resolveExampleSource: ExampleSourceResolver = (component, name) => {
	if (!component) return undefined;
	return exampleSources[`/src/examples/components/${component}/${name}.svelte`];
};

/** Group reference docs by their package (first slug segment), sorted within each group. */
function referencesByPackage(): [string, Reference[]][] {
	const byPackage = new Map<string, Reference[]>();
	for (const doc of allReferences) {
		const pkg = doc.slug.split('/')[0];
		if (!byPackage.has(pkg)) byPackage.set(pkg, []);
		byPackage.get(pkg)!.push(doc);
	}
	return [...byPackage.entries()]
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([pkg, docs]) => [pkg, sortCollection(docs)]);
}

/** LLM-optimized markdown for a single reference doc (examples inlined). */
export function generateReferenceMarkdown(doc: Reference): string {
	const sections: string[] = [`# ${doc.name}`];
	if (doc.description) sections.push(doc.description);

	const item = doc.slug.split('/').pop();
	const inlined = inlineExampleDirectives(doc.content, resolveExampleSource, item);
	const processed = processMarkdownContent(inlined);
	if (processed) sections.push(processed);

	if (doc.related?.length) {
		sections.push('## Related');
		sections.push(doc.related.map((r) => `- ${r}`).join('\n'));
	}

	return sections.join('\n\n');
}

/** LLM-optimized markdown for a guide. */
export function generateGuideMarkdown(name: string): string {
	const raw = guideSources[`/src/content/guides/${name}.md`];
	if (!raw) throw new Error(`Guide "${name}" not found`);

	let title = name;
	const frontmatter = raw.match(/^---\n([\s\S]*?)\n---/);
	const titleMatch = frontmatter?.[1].match(/^title:\s*(.+)$/m);
	if (titleMatch) title = titleMatch[1].trim().replace(/^["']|["']$/g, '');

	return `# ${title}\n\n${processMarkdownContent(raw)}`;
}

/** Root `/llms.txt` index — links to each page's `/llms.txt`. */
export function generateLlmsTxt(baseUrl: string): string {
	const sections: string[] = [
		`# LayerStack Documentation for LLMs

> LayerStack is a collection of Svelte actions, stores, state, table utilities, and general utils for Svelte.

This file links to LLM-optimized documentation in markdown format. Append \`/llms.txt\` to any page URL for its markdown, or see [/docs/llms.txt](${baseUrl}/docs/llms.txt) for everything in one file.`
	];

	const guides = sortCollection(allGuides.filter((g) => !g.draft));
	if (guides.length) {
		const items = guides
			.map(
				(g) =>
					`- [${g.name}](${baseUrl}/docs/guides/${g.slug}/llms.txt)${g.description ? `: ${g.description}` : ''}`
			)
			.join('\n');
		sections.push(`## Guides\n\n${items}`);
	}

	for (const [pkg, docs] of referencesByPackage()) {
		const items = docs
			.map(
				(d) =>
					`- [${d.name}](${baseUrl}/docs/${d.slug}/llms.txt)${d.description ? `: ${d.description}` : ''}`
			)
			.join('\n');
		sections.push(`## ${pkg}\n\n${items}`);
	}

	return sections.join('\n\n');
}

/** `/docs/llms.txt` — the full documentation inlined into one file. */
export function generateFullLlmsTxt(baseUrl: string): string {
	const sections: string[] = [
		`# LayerStack Full Documentation for LLMs

> LayerStack is a collection of Svelte actions, stores, state, table utilities, and general utils for Svelte.

This file contains the complete LLM-optimized documentation. Index: [/llms.txt](${baseUrl}/llms.txt).`
	];

	for (const [pkg, docs] of referencesByPackage()) {
		sections.push('---');
		sections.push(`# ${pkg}`);
		for (const doc of docs) {
			sections.push(generateReferenceMarkdown(doc));
		}
	}

	return sections.join('\n\n');
}
