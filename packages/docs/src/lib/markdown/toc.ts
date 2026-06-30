import GithubSlugger from 'github-slugger';

/**
 * Extract table of contents from markdown content
 */
export function extractTocFromMarkdown(
  content: string
): { id: string; text: string; level: number }[] {
  const toc: { id: string; text: string; level: number }[] = [];

  // A fresh slugger per document de-duplicates repeated slugs (e.g. headings
  // `string` and `string[]` both slugify to `string`), matching `rehype-slug`'s
  // behavior so TOC ids stay unique and line up with the rendered heading ids.
  const slugger = new GithubSlugger();

  // Strip HTML comments so commented-out headings are ignored
  const stripped = content.replace(/<!--[\s\S]*?-->/g, '');

  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(stripped)) !== null) {
    const level = match[1].length;
    // Strip inline MDC directives (e.g. `:icon{name="lucide:user" class="..."}`)
    // and markdown links (e.g. `[text](url)` → `text`)
    const text = match[2]
      .replace(/:[a-zA-Z][\w-]*\{[^}]*\}/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();
    if (!text) continue;
    const id = slugger.slug(text);
    toc.push({ id, text, level });
  }

  return toc;
}
