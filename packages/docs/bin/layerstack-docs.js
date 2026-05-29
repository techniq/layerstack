#!/usr/bin/env node
/**
 * Thin launcher that runs the TypeScript CLI (`src/cli.ts`) through `tsx`,
 * resolved from this package's own dependencies (no global install required).
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliPath = join(__dirname, '../src/cli.ts');

const require = createRequire(import.meta.url);
const tsxPkgPath = require.resolve('tsx/package.json');
const tsxPkg = require(tsxPkgPath);
const binRel = typeof tsxPkg.bin === 'string' ? tsxPkg.bin : tsxPkg.bin.tsx;
const tsxBin = join(dirname(tsxPkgPath), binRel);

const child = spawn(process.execPath, [tsxBin, cliPath, ...process.argv.slice(2)], {
	stdio: 'inherit'
});
child.on('exit', (code) => process.exit(code ?? 0));
