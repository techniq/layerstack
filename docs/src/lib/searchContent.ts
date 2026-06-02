import { allReferences, allGuides, type Reference, type Guide } from 'content-collections';
import { stripMarkdown } from '@layerstack/docs/markdown';
import type { SearchEntry } from '@layerstack/docs/search';

type TocEntry = { id: string; text: string; level: number };

function escapeRegexChars(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Extract the content under each heading from markdown, keyed by heading text.
 */
function extractHeadingContents(markdown: string, toc: TocEntry[]): Map<string, string> {
  const result = new Map<string, string>();
  const headingPositions: { text: string; start: number; end: number }[] = [];

  for (const heading of toc) {
    const headingPattern = new RegExp(
      `^#{1,6}\\s+${escapeRegexChars(heading.text)}(?:\\s*:[a-zA-Z][\\w-]*\\{[^}]*\\})*\\s*$`,
      'gm'
    );
    const match = headingPattern.exec(markdown);
    if (match) {
      headingPositions.push({
        text: heading.text,
        start: match.index + match[0].length,
        end: markdown.length,
      });
    }
  }

  headingPositions.sort((a, b) => a.start - b.start);
  for (let i = 0; i < headingPositions.length - 1; i++) {
    const nextHeadingMatch = markdown.slice(headingPositions[i].start).match(/^#{1,6}\s+/m);
    if (nextHeadingMatch) {
      headingPositions[i].end = headingPositions[i].start + (nextHeadingMatch.index ?? 0);
    }
  }

  for (const pos of headingPositions) {
    const rawContent = markdown.slice(pos.start, pos.end).trim();
    result.set(pos.text, stripMarkdown(rawContent).slice(0, 200));
  }

  return result;
}

function referenceToEntry(doc: Reference): SearchEntry {
  const description = doc.description ?? '';
  const content = stripMarkdown(doc.content);
  return {
    title: doc.name,
    slug: `docs/${doc.slug}`,
    content: description ? `${description} ${content}` : content,
    type: 'reference',
    category: doc.slug.split('/')[0],
  };
}

function referenceHeadingsToEntries(doc: Reference): SearchEntry[] {
  const seen = new Set<string>();
  const parentSlug = `docs/${doc.slug}`;
  const headingContents = extractHeadingContents(doc.content, doc.toc);

  return doc.toc
    .filter((heading: TocEntry) => {
      if (seen.has(heading.id)) return false;
      seen.add(heading.id);
      return true;
    })
    .map((heading: TocEntry) => ({
      title: heading.text,
      slug: `${parentSlug}#${heading.id}`,
      content: headingContents.get(heading.text) || doc.name,
      type: 'heading' as const,
      parent: doc.name,
      parentSlug,
      parentType: 'reference',
    }));
}

function guideToEntry(doc: Guide): SearchEntry {
  const description = doc.description ?? '';
  const content = stripMarkdown(doc.content);
  return {
    title: doc.name,
    slug: `docs/guides/${doc.slug}`,
    content: description ? `${description} ${content}` : content,
    type: 'guide',
  };
}

function guideHeadingsToEntries(doc: Guide): SearchEntry[] {
  const seen = new Set<string>();
  const parentSlug = `docs/guides/${doc.slug}`;
  const headingContents = extractHeadingContents(doc.content, doc.toc);

  return doc.toc
    .filter((heading: TocEntry) => {
      if (seen.has(heading.id)) return false;
      seen.add(heading.id);
      return true;
    })
    .map((heading: TocEntry) => ({
      title: heading.text,
      slug: `${parentSlug}#${heading.id}`,
      content: headingContents.get(heading.text) || doc.name,
      type: 'heading' as const,
      parent: doc.name,
      parentSlug,
      parentType: 'guide',
    }));
}

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
  ...guides.map(guideToEntry),
  ...guides.flatMap(guideHeadingsToEntries),
  ...allReferences.map(referenceToEntry),
  ...allReferences.flatMap(referenceHeadingsToEntries),
];
