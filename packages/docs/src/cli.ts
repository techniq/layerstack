/**
 * `layerstack-docs` CLI — build-time generators for LayerStack docs apps.
 *
 * Commands:
 *   generate-api         <components-dir> <output-dir>
 *   generate-catalog     <components-dir> <examples-dir> <catalog-dir>
 *   generate-screenshots <examples-dir> <screenshots-dir> [--base-url <url>] [--route-base <path>] [--all]
 *   generate-stackblitz  <source-dir> <output-file> [remote-sources-file] [--template-dir <dir>] [--source out=src ...] [--remote out=src ...]
 *   generate-releases    <owner/repo> <output-dir>
 */
import { writeComponentAPIs } from './lib/node/component-api.js';
import { writeExampleCatalogs } from './lib/node/example-catalog.js';
import { generateScreenshots } from './lib/node/screenshots.js';
import {
	generateStackBlitzFiles,
	getDefaultStackBlitzTemplateDir
} from './lib/node/stackblitz.js';
import { generateReleases } from './lib/node/releases.js';

type ParsedArgs = {
	positionals: string[];
	options: Record<string, string | boolean>;
	multi: Record<string, string[]>;
};

/** Flags that may be repeated and collected into a list (e.g. `--source a=b --source c=d`). */
const MULTI_FLAGS = new Set(['source', 'remote']);

function parseArgs(argv: string[]): ParsedArgs {
	const positionals: string[] = [];
	const options: Record<string, string | boolean> = {};
	const multi: Record<string, string[]> = {};

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (arg.startsWith('--')) {
			let key = arg.slice(2);
			let value: string | boolean;
			const eq = key.indexOf('=');
			if (eq !== -1) {
				value = key.slice(eq + 1);
				key = key.slice(0, eq);
			} else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) {
				value = argv[++i];
			} else {
				value = true;
			}
			if (MULTI_FLAGS.has(key) && typeof value === 'string') {
				(multi[key] ??= []).push(value);
			} else {
				options[key] = value;
			}
		} else {
			positionals.push(arg);
		}
	}

	return { positionals, options, multi };
}

/** Parse `output=source` pairs into a `{ [output]: source }` record. */
function parseKeyValueList(items: string[] = []): Record<string, string> {
	const result: Record<string, string> = {};
	for (const item of items) {
		const eq = item.indexOf('=');
		if (eq === -1) continue;
		result[item.slice(0, eq)] = item.slice(eq + 1);
	}
	return result;
}

function optString(options: Record<string, string | boolean>, key: string): string | undefined {
	const value = options[key];
	return typeof value === 'string' ? value : undefined;
}

const HELP = `layerstack-docs <command> [...args]

Commands:
  generate-api         <components-dir> <output-dir>
  generate-catalog     <components-dir> <examples-dir> <catalog-dir>
  generate-screenshots <examples-dir> <screenshots-dir> [--base-url <url>] [--route-base <path>] [--all]
  generate-stackblitz  <source-dir> <output-file> [remote-sources-file]
                       [--template-dir <dir>] [--source out=src ...] [--remote out=src ...]
  generate-releases    <owner/repo> <output-dir>
`;

async function main() {
	const [command, ...rest] = process.argv.slice(2);
	const { positionals, options, multi } = parseArgs(rest);

	switch (command) {
		case 'generate-api': {
			const [componentsDir, outputDir] = positionals;
			if (!componentsDir || !outputDir) {
				throw new Error('Usage: layerstack-docs generate-api <components-dir> <output-dir>');
			}
			writeComponentAPIs({ componentsDir, outputDir });
			break;
		}

		case 'generate-catalog': {
			const [componentsDir, examplesDir, catalogDir] = positionals;
			if (!componentsDir || !examplesDir || !catalogDir) {
				throw new Error(
					'Usage: layerstack-docs generate-catalog <components-dir> <examples-dir> <catalog-dir>'
				);
			}
			await writeExampleCatalogs({ componentsDir, examplesDir, catalogDir });
			break;
		}

		case 'generate-screenshots': {
			const [examplesDir, screenshotsDir] = positionals;
			if (!examplesDir || !screenshotsDir) {
				throw new Error(
					'Usage: layerstack-docs generate-screenshots <examples-dir> <screenshots-dir>'
				);
			}
			await generateScreenshots({
				examplesDir,
				screenshotsDir,
				baseUrl: optString(options, 'base-url'),
				routeBase: optString(options, 'route-base'),
				forceAll: options['all'] === true
			});
			break;
		}

		case 'generate-stackblitz': {
			const [sourceDir, outputFile, remoteSourcesFile] = positionals;
			if (!sourceDir || !outputFile) {
				throw new Error(
					'Usage: layerstack-docs generate-stackblitz <source-dir> <output-file> [remote-sources-file]'
				);
			}
			const templateDir = optString(options, 'template-dir') ?? getDefaultStackBlitzTemplateDir();
			generateStackBlitzFiles({
				templateDir,
				sourceDir,
				outputFile,
				remoteSourcesFile,
				sources: parseKeyValueList(multi['source']),
				remoteSources: parseKeyValueList(multi['remote'])
			});
			break;
		}

		case 'generate-releases': {
			const [repo, outputDir] = positionals;
			if (!repo || !outputDir) {
				throw new Error('Usage: layerstack-docs generate-releases <owner/repo> <output-dir>');
			}
			await generateReleases({ repo, outputDir });
			break;
		}

		case undefined:
		case '--help':
		case '-h':
			console.log(HELP);
			break;

		default:
			console.error(`Unknown command: ${command}\n`);
			console.log(HELP);
			process.exit(1);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
