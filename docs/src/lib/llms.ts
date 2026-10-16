import {
  allReferences,
  allGuides,
  allComponents,
  type Reference,
  type Component as ComponentDoc,
} from 'content-collections';
import { sortCollection } from '@layerstack/docs/collections';
import {
  generateApiTable,
  generateGuideMarkdown as generateGuideMarkdownContent,
  generateReferenceMarkdown as generateReferenceMarkdownDoc,
  groupBySlugSegment,
  linkListSection,
  type ExampleSourceResolver,
} from '@layerstack/docs/llms';
import type { ComponentAPI } from '@layerstack/docs/api';

const exampleSources = import.meta.glob<string>('/src/examples/**/*.svelte', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const guideSources = import.meta.glob<string>('/src/content/guides/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const resolveExampleSource: ExampleSourceResolver = (component, name) => {
  if (!component) return undefined;
  return exampleSources[`/src/examples/components/${component}/${name}.svelte`];
};

/** Group reference docs by their package (first slug segment), sorted within each group. */
function referencesByPackage(): [string, Reference[]][] {
  return groupBySlugSegment(allReferences, { sort: sortCollection });
}

/** LLM-optimized markdown for a single reference doc (examples inlined). */
export function generateReferenceMarkdown(doc: Reference): string {
  return generateReferenceMarkdownDoc(doc, {
    inlineExamples: true,
    resolveSource: resolveExampleSource,
    defaultComponent: doc.slug.split('/').pop(),
  });
}

/** Render the generated API tables for a component doc as a markdown section. */
function generateApiSection(doc: ComponentDoc): string {
  const apis = ((doc.apis ?? []) as (ComponentAPI & { label: string })[]).filter(
    (api) => api.properties?.length
  );
  if (!apis.length) return '';

  const sections = ['## API Reference'];
  for (const api of apis) {
    // Only label individual tables for compound components (e.g. `Tooltip.Root`, `Tooltip.Item`)
    if (apis.length > 1) sections.push(`### ${api.label}`);
    sections.push(generateApiTable(api));
  }
  return sections.join('\n\n');
}

/** LLM-optimized markdown for a component doc (examples inlined, API tables appended). */
export function generateComponentMarkdown(doc: ComponentDoc): string {
  return generateReferenceMarkdownDoc(doc, {
    inlineExamples: true,
    resolveSource: resolveExampleSource,
    defaultComponent: doc.slug,
    extraSections: [generateApiSection(doc)],
  });
}

/** LLM-optimized markdown for a guide. */
export function generateGuideMarkdown(name: string): string {
  const raw = guideSources[`/src/content/guides/${name}.md`];
  if (!raw) throw new Error(`Guide "${name}" not found`);
  return generateGuideMarkdownContent(raw, { fallbackTitle: name });
}

/** Root `/llms.txt` index — links to each page's `/llms.txt`. */
export function generateLlmsTxt(baseUrl: string): string {
  const sections: string[] = [
    `# LayerStack Documentation for LLMs

> LayerStack is a collection of Svelte actions, stores, state, table utilities, and general utils for Svelte.

This file links to LLM-optimized documentation in markdown format. Append \`/llms.txt\` to any page URL for its markdown, or see [/docs/llms.txt](${baseUrl}/docs/llms.txt) for everything in one file.`,
  ];

  const guides = sortCollection(allGuides.filter((g) => !g.draft));
  if (guides.length) {
    sections.push(
      linkListSection(
        'Guides',
        guides.map((g) => ({
          name: g.name,
          url: `${baseUrl}/docs/guides/${g.slug}/llms.txt`,
          description: g.description,
        }))
      )
    );
  }

  const components = sortCollection(allComponents);
  if (components.length) {
    sections.push(
      linkListSection(
        'ui',
        components.map((c) => ({
          name: c.name,
          url: `${baseUrl}/docs/ui/${c.slug}/llms.txt`,
          description: c.description,
        }))
      )
    );
  }

  for (const [pkg, docs] of referencesByPackage()) {
    sections.push(
      linkListSection(
        pkg,
        docs.map((d) => ({
          name: d.name,
          url: `${baseUrl}/docs/${d.slug}/llms.txt`,
          description: d.description,
        }))
      )
    );
  }

  return sections.join('\n\n');
}

/** `/docs/llms.txt` — the full documentation inlined into one file. */
export function generateFullLlmsTxt(baseUrl: string): string {
  const sections: string[] = [
    `# LayerStack Full Documentation for LLMs

> LayerStack is a collection of Svelte actions, stores, state, table utilities, and general utils for Svelte.

This file contains the complete LLM-optimized documentation. Index: [/llms.txt](${baseUrl}/llms.txt).`,
  ];

  const components = sortCollection(allComponents);
  if (components.length) {
    sections.push('---');
    sections.push('# ui');
    for (const doc of components) {
      sections.push(generateComponentMarkdown(doc));
    }
  }

  for (const [pkg, docs] of referencesByPackage()) {
    sections.push('---');
    sections.push(`# ${pkg}`);
    for (const doc of docs) {
      sections.push(generateReferenceMarkdown(doc));
    }
  }

  return sections.join('\n\n');
}
