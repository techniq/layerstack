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

/**
 * Replace `:example{...}` directives with inlined fenced code blocks, using a
 * caller-provided source resolver. Run this BEFORE `processMarkdownContent`.
 */
export function inlineExampleDirectives(
	content: string,
	resolveSource: ExampleSourceResolver,
	defaultComponent?: string
): string {
	// Strip HTML comments first so commented-out examples aren't inlined
	content = content.replace(/<!--[\s\S]*?-->/g, '');

	// Cross-component examples: :example{ component="X" name="Y" ... } (run first)
	content = content.replace(
		/:example\{\s*component="([^"]+)"\s+name="([^"]+)"[^}]*\}/g,
		(_match, component: string, name: string) => {
			const raw = resolveSource(component, name);
			return raw ? '```svelte\n' + trimCode(raw) + '\n```' : `See example: ${component}/${name}`;
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
export function processMarkdownContent(content: string): string {
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

	// Any remaining :example directives → plain text
	content = content.replace(
		/:example\{\s*component="([^"]+)"\s+name="([^"]+)"[^}]*\}/g,
		'See example: $1/$2'
	);
	content = content.replace(/:example\{\s*name="([^"]+)"[^}]*\}/g, 'See example: $1');

	// Collapse blank lines
	content = content.replace(/\n{3,}/g, '\n\n');

	return content.trim();
}
