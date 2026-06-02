import FlexSearch, { type Index as FlexSearchIndex } from 'flexsearch';
import { stripMarkdown } from './markdown/utils.js';

/**
 * A single searchable entry. `type` is intentionally a free string so each docs app
 * can define its own taxonomy (`page`, `guide`, `component`, `util`, `example`,
 * `reference`, `heading`, …). Build these in a docs-local `searchContent` module and
 * serve them from `/api/search.json`.
 */
export type SearchEntry = {
  title: string;
  slug: string;
  content: string;
  type: string;
  category?: string;
  /** For examples, the component/item name */
  component?: string;
  /** For examples, the example name */
  example?: string;
  /** For examples, optional author-curated search keywords */
  tags?: string[];
  /** For headings, the parent page title */
  parent?: string;
  /** For headings, the parent page slug (without hash) */
  parentSlug?: string;
  /** For headings, the parent entry type (used for grouping) */
  parentType?: string;
};

let searchIndex: FlexSearchIndex;
let searchData: SearchEntry[] = [];
let initialized = false;

/**
 * Initialize the search index with data fetched from the API (default `/api/search.json`).
 */
export async function initSearch(endpoint = '/api/search.json'): Promise<void> {
  if (initialized) return;

  const response = await fetch(endpoint);
  searchData = await response.json();

  searchIndex = new FlexSearch.Index({
    tokenize: 'forward',
  });

  searchData.forEach((entry, i) => {
    const text = `${entry.title} ${entry.content}`;
    searchIndex.add(i, text);
  });

  initialized = true;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function queryTokens(query: string): string[] {
  return query.toLowerCase().trim().split(/\s+/).filter(Boolean);
}

function highlightMatch(text: string, query: string): string {
  const tokens = queryTokens(query).map(escapeRegex);
  if (!tokens.length) return text;
  const regex = new RegExp(tokens.join('|'), 'gi');
  return text.replace(regex, (match) => `<mark class="rounded">${match}</mark>`);
}

function getSnippet(text: string, query: string, contextLength = 80): string {
  const lowerText = text.toLowerCase();
  const tokens = queryTokens(query);

  // Anchor the snippet on the earliest-occurring token
  let anchorIndex = -1;
  let anchorLength = 0;
  for (const token of tokens) {
    const idx = lowerText.indexOf(token);
    if (idx !== -1 && (anchorIndex === -1 || idx < anchorIndex)) {
      anchorIndex = idx;
      anchorLength = token.length;
    }
  }

  if (anchorIndex === -1) {
    return text.substring(0, contextLength) + (text.length > contextLength ? '...' : '');
  }

  const start = Math.max(0, anchorIndex - 20);
  const end = Math.min(text.length, anchorIndex + anchorLength + contextLength);
  const snippet = text.substring(start, end).trim();

  return (
    (start > 0 ? '...' : '') + highlightMatch(snippet, query) + (end < text.length ? '...' : '')
  );
}

/**
 * Search the index and return matching entries (with highlighted snippets).
 */
export function search(query: string): SearchEntry[] {
  if (!initialized || !query.trim()) return [];

  const searchTerm = query.trim();

  const results = searchIndex.search(searchTerm) as number[];

  return results
    .map((idx) => searchData[idx])
    .map((entry) => ({
      ...entry,
      content: entry.type === 'example' ? entry.content : getSnippet(entry.content, searchTerm),
    }));
}

// ─── Index builders (build-time) ──────────────────────────────────────────────
// Helpers for assembling the `/api/search.json` payload from content collections.

export type TocEntry = { id: string; text: string; level: number };

/** Minimal content-collection document shape consumed by {@link buildSearchEntries}. */
export type SearchDoc = {
  name: string;
  slug: string;
  description?: string | null;
  content: string;
  toc: TocEntry[];
};

/**
 * Extract the cleaned text under each heading from markdown, keyed by heading text.
 * Gives per-heading search entries a content snippet.
 */
export function extractHeadingContents(markdown: string, toc: TocEntry[]): Map<string, string> {
  const result = new Map<string, string>();
  const headingPositions: { text: string; start: number; end: number }[] = [];

  for (const heading of toc) {
    // Match the heading line, allowing trailing MDC directives (e.g. `## Title :icon{...}`)
    const headingPattern = new RegExp(
      `^#{1,6}\\s+${escapeRegex(heading.text)}(?:\\s*:[a-zA-Z][\\w-]*\\{[^}]*\\})*\\s*$`,
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

/**
 * Build a page `SearchEntry` plus one entry per heading for each doc in a collection.
 * Pass a `category` resolver to tag page entries (set `headingCategory` to also tag headings).
 */
export function buildSearchEntries<T extends SearchDoc>(
  docs: T[],
  config: {
    /** Entry `type` for the page (and `parentType` for its headings), e.g. `reference`. */
    type: string;
    /** Slug prefix prepended to each doc's slug, e.g. `docs/components`. */
    slugPrefix: string;
    /** Optional category resolver applied to page entries. */
    category?: (doc: T) => string | undefined;
    /** Also apply `category` to heading entries (default `false`). */
    headingCategory?: boolean;
  }
): SearchEntry[] {
  return docs.flatMap((doc) => {
    const parentSlug = config.slugPrefix ? `${config.slugPrefix}/${doc.slug}` : doc.slug;
    const category = config.category?.(doc);
    const description = doc.description ?? '';
    const content = stripMarkdown(doc.content);

    const pageEntry: SearchEntry = {
      title: doc.name,
      slug: parentSlug,
      content: description ? `${description} ${content}` : content,
      type: config.type,
      ...(category != null ? { category } : {}),
    };

    const headingContents = extractHeadingContents(doc.content, doc.toc);
    const seen = new Set<string>();
    const headingEntries = doc.toc
      .filter((heading) => {
        if (seen.has(heading.id)) return false;
        seen.add(heading.id);
        return true;
      })
      .map(
        (heading): SearchEntry => ({
          title: heading.text,
          slug: `${parentSlug}#${heading.id}`,
          content: headingContents.get(heading.text) || doc.name,
          type: 'heading',
          parent: doc.name,
          parentSlug,
          parentType: config.type,
          ...(config.headingCategory && category != null ? { category } : {}),
        })
      );

    return [pageEntry, ...headingEntries];
  });
}
