import { allReferences, allGuides } from 'content-collections';
import { buildSearchEntries, type SearchEntry } from '@layerstack/docs/search';

const topLevelPages: SearchEntry[] = [
  {
    title: 'Introduction',
    slug: '',
    content:
      'LayerStack — a collection of Svelte actions, stores, state, table utilities, and general utils',
    type: 'page',
  },
];

const guides = allGuides.filter((g) => !g.draft);

export const searchContent: SearchEntry[] = [
  ...topLevelPages,
  ...buildSearchEntries(guides, { type: 'guide', slugPrefix: 'docs/guides' }),
  ...buildSearchEntries(allReferences, {
    type: 'reference',
    slugPrefix: 'docs',
    category: (doc) => doc.slug.split('/')[0],
  }),
];
