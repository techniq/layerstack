import FlexSearch, { type Index as FlexSearchIndex } from 'flexsearch';

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
