import { error } from '@sveltejs/kit';
import {
  allReferences,
  type Reference as ReferenceMetadata,
  allGuides,
  type Guide as GuideMetadata,
} from 'content-collections';
import { createContentLoaders, type ContentType } from '@layerstack/docs/content';
import { loadExample, loadExampleByPath } from '$lib/examples.js';

type Metadata = ReferenceMetadata | GuideMetadata;

const modules = import.meta.glob<{ default: import('svelte').Component; metadata: Metadata }>(
  '/src/content/**/*.md'
);

const contentLoaders = createContentLoaders<Metadata>({
  modules,
  getMetadata,
  loadExample,
  loadExampleByPath,
  notFound: () => error(404, 'Could not find the document.'),
});

function getMetadata(slug: string, type: ContentType): Metadata | undefined {
  if (type === 'guides') {
    return allGuides.find((g) => g.slug === slug);
  }
  return allReferences.find((r) => r.slug === slug);
}

export const { getMarkdownComponent, loadExamplesFromMarkdown } = contentLoaders;
