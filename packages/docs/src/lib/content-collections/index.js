import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { defineCollection, defineConfig } from '@content-collections/core';
import { compileMarkdown } from '@content-collections/markdown';
import { toPascalCase } from '@layerstack/utils';
import { z } from 'zod';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import { extractTocFromMarkdown } from '../markdown/index.js';
import { prettyCodeOptions } from '../markdown/config/pretty-code.js';
import { getFirstExampleName } from '../content.js';
export const componentSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  layers: z.array(z.string()).default([]),
  /**
   * Whether the component renders inside an `<Svg|Canvas|Html>` layer.
   */
  withinLayer: z.boolean().default(true),
  related: z.array(z.string()).default([]),
  /**
   * Components whose generated API to document on this page. Use for compound components
   * to show each part (e.g. `Tooltip.Root`, `Tooltip.Item`) on a single page. Each entry is
   * either a component name (label derived relative to the page, e.g. `TooltipItem` ->
   * `Tooltip.Item`) or `{ name, label }` for an explicit heading. When omitted, defaults to
   * the page's own component.
   */
  components: z
    .array(z.union([z.string(), z.object({ name: z.string(), label: z.string().optional() })]))
    .optional(),
  resize: z.boolean().optional(),
  tableOfContents: z.boolean().default(true),
  order: z.number().optional(),
  content: z.string(),
});
export const utilSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  layers: z.array(z.string()).default([]),
  related: z.array(z.string()).default([]),
  resize: z.boolean().optional(),
  tableOfContents: z.boolean().default(true),
  order: z.number().optional(),
  content: z.string(),
});
export const guideSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  order: z.number().optional(),
  draft: z.boolean().default(false),
  content: z.string(),
});
export const referenceSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  packageName: z.string().optional(),
  kind: z.string().optional(),
  sourceFile: z.string().optional(),
  related: z.array(z.string()).default([]),
  features: z.array(z.string()).optional(),
  hideUsage: z.boolean().optional(),
  hideTableOfContents: z.boolean().optional(),
  tableOfContents: z.boolean().default(true),
  status: z.string().optional(),
  order: z.number().optional(),
  draft: z.boolean().default(false),
  content: z.string(),
});
export const releaseSchema = z.object({
  title: z.string(),
  tag: z.string(),
  date: z.coerce.date(),
  url: z.string(),
  draft: z.boolean().default(false),
  prerelease: z.boolean().default(false),
  author: z.string(),
  content: z.string(),
});
function sourceBase(options) {
  return `https://github.com/${options.repo}/blob/${options.branch}/packages/${options.packageName}/src/lib`;
}
function readSource(root, sourceUrlBase, rel) {
  const full = join(root, rel);
  if (!existsSync(full)) return null;
  try {
    return {
      source: readFileSync(full, 'utf-8'),
      url: `${sourceUrlBase}/${rel}`,
    };
  } catch {
    return null;
  }
}
function normalizeOptions(options) {
  return {
    packageName: options.packageName,
    repo: options.repo ?? `techniq/${options.packageName}`,
    branch: options.branch ?? 'main',
    packagesRoot: options.packagesRoot ?? '../packages',
    referenceDirectory: options.referenceDirectory ?? 'src/content/reference',
  };
}
export function createContentConfig(options) {
  const normalized = normalizeOptions(options);
  const packagesRoot = join(process.cwd(), normalized.packagesRoot);
  const packageRoot = join(packagesRoot, `${normalized.packageName}/src/lib`);
  const githubBase = sourceBase(normalized);
  const components = defineCollection({
    name: 'components',
    directory: 'src/content/components',
    include: '**/*.md',
    schema: componentSchema,
    transform: async (doc, context) => {
      const { fileName, path } = doc._meta;
      const name = doc.name ?? toPascalCase(fileName.replace('.md', ''));
      const componentsRoot = join(packageRoot, 'components');
      const componentsSourceBase = `${githubBase}/components`;
      const subdirs = existsSync(componentsRoot)
        ? readdirSync(componentsRoot).filter(
            (entry) => !entry.startsWith('.') && statSync(join(componentsRoot, entry)).isDirectory()
          )
        : [];
      const searchDirs = ['', ...subdirs.map((d) => `${d}/`)];
      const sources = {};
      const sourceUrls = {};
      let primary = null;
      let splitDir = '';
      for (const dir of searchDirs) {
        const hit =
          readSource(componentsRoot, componentsSourceBase, `${dir}${path}/${path}.base.svelte`) ??
          readSource(componentsRoot, componentsSourceBase, `${dir}${path}/${path}.svelte`) ??
          readSource(componentsRoot, componentsSourceBase, `${dir}${path}.svelte`);
        if (hit) {
          primary = hit;
          splitDir = `${dir}${path}/`;
          break;
        }
      }
      if (primary && !primary.url.endsWith('.base.svelte')) {
        for (const layer of ['svg', 'canvas', 'html']) {
          const variant = readSource(
            componentsRoot,
            componentsSourceBase,
            `${splitDir}${path}.${layer}.svelte`
          );
          if (variant) {
            sources[layer] = variant.source;
            sourceUrls[layer] = variant.url;
          }
        }
      }
      const toc = extractTocFromMarkdown(doc.content);
      const catalogPath = join(process.cwd(), `src/examples/catalog/${path}.json`);
      let catalogFirstExample;
      if (existsSync(catalogPath)) {
        if (!toc.some((t) => t.id === 'examples')) {
          toc.push({ id: 'examples', text: 'Examples', level: 2 });
        }
        try {
          const catalog = JSON.parse(readFileSync(catalogPath, 'utf-8'));
          catalogFirstExample = catalog.examples?.[0]?.name;
        } catch {
          // ignore malformed generated catalog files
        }
      }
      const renderInline = async (text) => {
        const html = await compileMarkdown(
          context,
          { ...doc, content: text },
          {
            remarkPlugins: [remarkGfm],
          }
        );
        return html
          .replace(/^<p>/, '')
          .replace(/<\/p>\s*$/, '')
          .trim();
      };
      const walkProps = async (props = []) => {
        for (const p of props) {
          if (p.description) p.descriptionHtml = await renderInline(p.description);
          if (p.properties) await walkProps(p.properties);
        }
      };
      const loadApi = async (componentName) => {
        const componentApiPath = join(process.cwd(), `generated/api/${componentName}.json`);
        if (!existsSync(componentApiPath)) return null;
        try {
          const parsed = JSON.parse(readFileSync(componentApiPath, 'utf-8'));
          await walkProps(parsed.properties);
          return parsed;
        } catch {
          // ignore malformed generated API files
          return null;
        }
      };
      // Derive a display label for a sub-component relative to the page's component, e.g.
      // page "Tooltip" + "TooltipItem" -> "Tooltip.Item". Unrelated names are left as-is.
      const deriveLabel = (componentName) =>
        componentName !== name && componentName.startsWith(name)
          ? `${name}.${componentName.slice(name.length)}`
          : componentName;
      // Default to the page's own component (existing behavior) unless `components` enumerates
      // the parts of a compound component. Entries may be a string or `{ name, label }`.
      const componentList = (doc.components?.length ? doc.components : [path]).map((entry) =>
        typeof entry === 'string'
          ? { name: entry, label: deriveLabel(entry) }
          : { name: entry.name, label: entry.label ?? deriveLabel(entry.name) }
      );
      // One entry per documented component (the `ComponentAPI` plus a display `label`).
      const apis = [];
      for (const entry of componentList) {
        const componentApi = await loadApi(entry.name);
        if (componentApi?.properties?.length) {
          apis.push({ ...componentApi, label: entry.label });
        }
      }
      if (apis.length) {
        toc.push({ id: 'api-reference', text: 'API Reference', level: 2 });
      }
      if (doc.related.length) {
        toc.push({ id: 'related', text: 'Related', level: 2 });
      }
      return {
        ...doc,
        name,
        slug: path,
        source: primary?.source ?? '',
        sourceUrl: primary?.url ?? '',
        sources,
        sourceUrls,
        defaultExample: getFirstExampleName(doc.content) ?? catalogFirstExample,
        toc,
        apis,
      };
    },
  });
  const utils = defineCollection({
    name: 'utils',
    directory: 'src/content/utils',
    include: '**/*.md',
    schema: utilSchema,
    transform: async (doc) => {
      const { fileName, path } = doc._meta;
      const source = readSource(join(packageRoot, 'utils'), `${githubBase}/utils`, `${path}.ts`);
      return {
        ...doc,
        name: doc.name ?? fileName.replace('.md', ''),
        slug: fileName.replace('.md', '').toLowerCase(),
        source: source?.source ?? '',
        sourceUrl: source?.url ?? '',
        toc: extractTocFromMarkdown(doc.content),
      };
    },
  });
  const guides = defineCollection({
    name: 'guides',
    directory: 'src/content/guides',
    include: '**/*.md',
    schema: guideSchema,
    transform: async (doc) => {
      const { path } = doc._meta;
      return {
        ...doc,
        name: doc.title,
        slug: path,
        toc: extractTocFromMarkdown(doc.content),
      };
    },
  });
  const references = defineCollection({
    name: 'references',
    directory: normalized.referenceDirectory,
    include: '**/*.md',
    schema: referenceSchema,
    transform: async (doc) => {
      const { path } = doc._meta;
      const referenceSourceBase = `https://github.com/${normalized.repo}/blob/${normalized.branch}/packages`;

      // Explicit `sourceFile` (relative to `packages/`) always wins. Otherwise infer
      // the source from the conventional `<package>/src/lib/<item>.{ts,svelte.ts}` location
      // derived from the doc path (e.g. `svelte-stores/debounceStore`). A camelCase fallback
      // covers PascalCase items (`utils/Duration` -> `duration.ts`,
      // `svelte-state/SelectionState` -> `selectionState.svelte.ts`).
      const explicit = doc.sourceFile?.replace(/^\/?packages\//, '').replace(/^\//, '');
      let source = null;
      let sourceFile = explicit;

      if (explicit) {
        source = readSource(packagesRoot, referenceSourceBase, explicit);
      } else {
        const segments = path.split('/');
        const pkg = segments[0];
        const rest = segments.slice(1);
        if (pkg && rest.length) {
          const dir = rest.slice(0, -1).join('/');
          const item = rest[rest.length - 1];
          const camelItem = item.charAt(0).toLowerCase() + item.slice(1);
          const prefix = `${pkg}/src/lib/${dir ? `${dir}/` : ''}`;
          const candidates = [
            `${prefix}${item}.ts`,
            `${prefix}${item}.svelte.ts`,
            `${prefix}${camelItem}.ts`,
            `${prefix}${camelItem}.svelte.ts`,
          ];
          for (const candidate of candidates) {
            const hit = readSource(packagesRoot, referenceSourceBase, candidate);
            if (hit) {
              source = hit;
              sourceFile = candidate;
              break;
            }
          }
        }
      }

      const toc = extractTocFromMarkdown(doc.content);
      if (doc.related.length) {
        toc.push({ id: 'related', text: 'Related', level: 2 });
      }
      return {
        ...doc,
        name: doc.title,
        slug: path,
        sourceFile,
        source: source?.source ?? '',
        sourceUrl: source?.url ?? '',
        toc,
      };
    },
  });
  const releases = defineCollection({
    name: 'releases',
    directory: 'generated/releases',
    include: '**/*.md',
    schema: releaseSchema,
    transform: async (doc, context) => {
      const { fileName } = doc._meta;
      return {
        ...doc,
        slug: fileName.replace('.md', ''),
        html: await compileMarkdown(context, doc, {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
        }),
      };
    },
  });
  return defineConfig({
    content: [components, utils, guides, references, releases],
  });
}
