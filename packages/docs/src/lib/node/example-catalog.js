/**
 * LayerChart Example Index Generator
 *
 * This script generates a catalog for each component that shows:
 * - All examples available for that component
 * - All usage of that component across all examples
 *
 * @description
 * Scans all components in packages/layerchart/src/lib/components and for each:
 * - Finds examples in docs/src/examples/[ComponentName]/
 * - Searches all examples for usage of <ComponentName
 * - Generates docs/src/examples/catalog/[ComponentName].json
 *
 * @usage
 * pnpm generate:catalog
 *
 * @example
 * // Generates catalog files like:
 * // docs/src/examples/catalog/Rect.json
 * // docs/src/examples/catalog/Area.json
 */
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
let COMPONENTS_DIR = '';
let EXAMPLES_DIR = '';
/**
 * Get all canonical component files from the components directory (recursively).
 *
 * Skips per-layer variants (`*.svg.svelte`, `*.canvas.svelte`, `*.html.svelte`)
 * and the shared base impl (`*.base.svelte`) — only the canonical
 * `<Name>.svelte` is treated as a public component.
 */
function getComponents(dir) {
  const components = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isFile() && entry.name.endsWith('.svelte')) {
      if (/\.(svg|canvas|html|base)\.svelte$/.test(entry.name)) continue;
      // Remove .svelte extension to get component name
      const componentName = entry.name.replace('.svelte', '');
      components.push(componentName);
    } else if (entry.isDirectory()) {
      // Recursively scan subdirectories
      components.push(...getComponents(fullPath));
    }
  }
  return components.sort();
}
/**
 * Extract all component usages from an example file
 */
function extractComponentsFromExample(filePath, allComponents) {
  const components = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  // Track which components we've found to avoid duplicates
  const foundComponents = new Set();
  // Search for each known component in the file
  for (const componentName of allComponents) {
    // Use word boundary to avoid matching components with similar prefixes
    // Match if followed by: whitespace, >, /, ., :, or end-of-line
    const searchPattern = new RegExp(`<${componentName}(?:\\s|>|/|\\.|:|$)`, 'i');
    lines.forEach((line, index) => {
      if (searchPattern.test(line) && !foundComponents.has(componentName)) {
        foundComponents.add(componentName);
        components.push({
          component: componentName,
          lineNumber: index + 1,
          line: line.trim(),
        });
      }
    });
  }
  // Sort by line number
  return components.sort((a, b) => a.lineNumber - b.lineNumber);
}
/**
 * Extract module-level exports (title, description, tags) from a <script module> block
 */
function extractModuleExports(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const moduleMatch = content.match(/<script\s+module[^>]*>([\s\S]*?)<\/script>/);
  if (!moduleMatch) return {};
  const moduleContent = moduleMatch[1];
  const result = {};
  const titleMatch = moduleContent.match(/export\s+(?:let|const)\s+title\s*=\s*['"`](.+?)['"`]/);
  if (titleMatch) result.title = titleMatch[1];
  const descMatch = moduleContent.match(
    /export\s+(?:let|const)\s+description\s*=\s*['"`](.+?)['"`]/
  );
  if (descMatch) result.description = descMatch[1];
  const tagsMatch = moduleContent.match(/export\s+(?:let|const)\s+tags\s*=\s*\[([\s\S]*?)\]/);
  if (tagsMatch) {
    const items = tagsMatch[1].match(/['"`]([^'"`]+)['"`]/g);
    if (items?.length) {
      result.tags = items.map((s) => s.slice(1, -1));
    }
  }
  return result;
}
/**
 * Read created/updated dates for every example file from git history.
 *
 * Runs a single `git log` over the examples directory (newest first) and maps renames
 * back to the file's current path.  Returns `Map<relativePath, { createdAt, updatedAt }>`
 * keyed by `<Component>/<example>.svelte`, or `null` when git is unavailable or the
 * repository is a shallow clone (where history is truncated and dates would be wrong).
 */
export function getExampleGitDates(examplesDir) {
  const git = (args) =>
    execFileSync('git', args, {
      cwd: examplesDir,
      encoding: 'utf-8',
      maxBuffer: 256 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'ignore'],
    });

  let output;
  try {
    if (git(['rev-parse', '--is-shallow-repository']).trim() !== 'false') {
      return null;
    }
    // `-z` avoids path quoting, `--relative` makes paths relative to `examplesDir`,
    // and `--date-order` guarantees children are listed before their parents
    output = git([
      'log',
      '-z',
      '--date-order',
      '--format=%x01%ct',
      '--name-status',
      '-M',
      '--relative',
      '--',
      '.',
    ]);
  } catch (error) {
    return null;
  }

  /** @type {Map<string, { created: number, updated: number }>} */
  const timestamps = new Map();
  // Historical path -> current path (`null` once that path's lineage has ended)
  const aliases = new Map();
  const resolve = (p) => (aliases.has(p) ? aliases.get(p) : p);
  const record = (p, time) => {
    if (p == null) return;
    const entry = timestamps.get(p);
    if (entry) {
      entry.created = Math.min(entry.created, time);
      entry.updated = Math.max(entry.updated, time);
    } else {
      timestamps.set(p, { created: time, updated: time });
    }
  };

  const tokens = output.split('\0');
  let time = 0;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].replace(/^\n+/, '');
    if (!token) continue;
    if (token.startsWith('\x01')) {
      time = Number(token.slice(1)) * 1000;
      continue;
    }
    const status = token[0];
    if (status === 'R' || status === 'C') {
      const from = tokens[++i];
      const to = tokens[++i];
      const current = resolve(to);
      record(current, time);
      // Older history at `to` belongs to a different file
      aliases.set(to, null);
      if (status === 'R') {
        aliases.set(from, current);
      }
    } else {
      const file = tokens[++i];
      record(resolve(file), time);
      if (status === 'A' || status === 'D') {
        // Anything older at this path was a previous file that has since been removed
        aliases.set(file, null);
      }
    }
  }

  const dates = new Map();
  for (const [file, { created, updated }] of timestamps) {
    dates.set(file, {
      createdAt: new Date(created).toISOString(),
      updatedAt: new Date(updated).toISOString(),
    });
  }
  return dates;
}

/**
 * Get all examples for a specific component
 *
 * @param gitDates - result of `getExampleGitDates()`, or `null`/`undefined` if unavailable
 * @param existingExamples - examples from the previously generated catalog, used to keep
 *   existing dates when git history is unavailable (or the file has not been committed yet)
 */
function getComponentExamples(componentName, allComponents, gitDates, existingExamples = []) {
  const componentExamplesDir = path.join(EXAMPLES_DIR, componentName);
  const examples = [];
  // Check if the component examples directory exists
  if (!fs.existsSync(componentExamplesDir)) {
    return examples;
  }
  const entries = fs.readdirSync(componentExamplesDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.svelte')) {
      // Remove .svelte extension
      const exampleName = entry.name.replace('.svelte', '');
      const filePath = path.join(componentExamplesDir, entry.name);
      // Extract all components used in this example
      const componentsInExample = extractComponentsFromExample(filePath, allComponents);
      // Extract module-level exports
      const moduleExports = extractModuleExports(filePath);
      const info = {
        name: exampleName,
        title: moduleExports.title ?? exampleName.replaceAll('-', ' '),
        path: `/docs/components/${componentName}/${exampleName}`,
        components: componentsInExample,
      };
      if (moduleExports.description) {
        info.description = moduleExports.description;
      }
      if (moduleExports.tags?.length) {
        info.tags = moduleExports.tags;
      }
      const dates =
        gitDates?.get(`${componentName}/${entry.name}`) ??
        existingExamples.find((e) => e.name === exampleName);
      if (dates?.createdAt) {
        info.createdAt = dates.createdAt;
      }
      if (dates?.updatedAt) {
        info.updatedAt = dates.updatedAt;
      }
      examples.push(info);
    }
  }
  return examples.sort((a, b) => a.name.localeCompare(b.name));
}
/**
 * Search all examples for usage of a component
 */
function findComponentUsage(componentName) {
  const usage = [];
  const entries = fs.readdirSync(EXAMPLES_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const exampleComponentDir = path.join(EXAMPLES_DIR, entry.name);
      const exampleFiles = fs.readdirSync(exampleComponentDir, { withFileTypes: true });
      for (const exampleFile of exampleFiles) {
        if (exampleFile.isFile() && exampleFile.name.endsWith('.svelte')) {
          const filePath = path.join(exampleComponentDir, exampleFile.name);
          const content = fs.readFileSync(filePath, 'utf-8');
          const lines = content.split('\n');
          // Search for <ComponentName usage
          // Use word boundary to avoid matching components with similar prefixes
          // e.g., searching for "AnnotationLine" shouldn't match "AnnotationLineControls"
          // Match if followed by: whitespace, >, /, ., :, or end-of-line
          const searchPattern = new RegExp(`<${componentName}(?:\\s|>|/|\\.|:|$)`, 'i');
          lines.forEach((line, index) => {
            // Create new regex each time to avoid stateful issues with global flag
            if (searchPattern.test(line)) {
              const exampleName = exampleFile.name.replace('.svelte', '');
              usage.push({
                example: exampleName,
                component: entry.name,
                path: `/docs/components/${entry.name}/${exampleName}`,
                lineNumber: index + 1,
                line: line.trim(),
              });
            }
          });
        }
      }
    }
  }
  return usage.sort((a, b) => {
    const pathCompare = a.path.localeCompare(b.path);
    return pathCompare !== 0 ? pathCompare : a.lineNumber - b.lineNumber;
  });
}
/**
 * Ensure directory exists
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
/**
 * Strip git-derived dates from examples so they don't count as catalog content changes
 */
function withoutDates(examples) {
  return Array.isArray(examples)
    ? examples.map(({ createdAt, updatedAt, ...rest }) => rest)
    : examples;
}
/**
 * Generate catalog for a single component
 *
 * @param gitDates - result of `getExampleGitDates()`.  When `null`/`undefined`, example
 *   dates are carried over from the existing catalog file.
 */
export function generateComponentCatalog(componentName, catalogPath, allComponents, gitDates) {
  console.log(`Processing ${componentName}...`);
  // Read existing catalog (if any)
  let existingCatalog;
  if (fs.existsSync(catalogPath)) {
    try {
      existingCatalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
    } catch (error) {
      // If we can't read or parse, treat as new file
    }
  }
  const examples = getComponentExamples(
    componentName,
    allComponents,
    gitDates,
    Array.isArray(existingCatalog?.examples) ? existingCatalog.examples : []
  );
  const usage = findComponentUsage(componentName);
  // Check if content has changed (excluding updatedAt field and example dates, which follow
  // git history and would otherwise bump `updatedAt` again after every commit)
  const contentUnchanged =
    existingCatalog?.component === componentName &&
    JSON.stringify(withoutDates(existingCatalog.examples)) ===
      JSON.stringify(withoutDates(examples)) &&
    JSON.stringify(existingCatalog.usage) === JSON.stringify(usage);
  return {
    component: componentName,
    examples,
    usage,
    updatedAt: (contentUnchanged && existingCatalog.updatedAt) || new Date().toISOString(),
  };
}
export async function writeExampleCatalogs({
  componentsDir,
  examplesDir,
  catalogDir,
  title = 'Example Catalog Generator',
  logger = console,
}) {
  COMPONENTS_DIR = componentsDir;
  EXAMPLES_DIR = examplesDir;
  logger.log(title);
  logger.log('===================================\n');
  // Ensure catalog directory exists
  ensureDir(catalogDir);
  // Get all components
  const components = getComponents(componentsDir);
  logger.log(`Found ${components.length} components\n`);
  const gitDates = getExampleGitDates(examplesDir);
  if (!gitDates) {
    logger.log(
      'Git history unavailable (no git or shallow clone), keeping existing example dates\n'
    );
  }
  let processedCount = 0;
  let totalExamples = 0;
  let totalUsages = 0;
  // Process each component
  for (const componentName of components) {
    // Write catalog file
    const catalogPath = path.join(catalogDir, `${componentName}.json`);
    const catalog = generateComponentCatalog(componentName, catalogPath, components, gitDates);
    fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
    logger.log(`  ✓ Examples: ${catalog.examples.length}`);
    logger.log(`  ✓ Usages: ${catalog.usage.length}`);
    logger.log(`  ✓ Saved to ${catalogPath}\n`);
    processedCount++;
    totalExamples += catalog.examples.length;
    totalUsages += catalog.usage.length;
  }
  // Print summary
  logger.log('===================================');
  logger.log('Summary:');
  logger.log(`  Components processed: ${processedCount}`);
  logger.log(`  Total examples: ${totalExamples}`);
  logger.log(`  Total usages: ${totalUsages}`);
  logger.log(`\n✅ Catalog files saved to ${catalogDir}`);
  return { processedCount, totalExamples, totalUsages };
}
