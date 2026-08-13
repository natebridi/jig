import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Checks that the published declarations are self-contained.
 *
 * The JS build bundles everything except React, so the declarations have to be
 * rolled up to match — a .d.ts that re-exports from './button' or from
 * @jig-ui/styles points at something the consumer never receives. The rollup
 * that does this (vite-plugin-dts + api-extractor) rolls entries up in
 * parallel and intermittently loses a race over its own temp files, leaving
 * the un-rolled-up declarations behind *and still exiting zero*. Without this
 * check that ships as a package whose every export is typed `any`.
 */

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

/** One per `exports` subpath that ships types. */
const ENTRIES = ['index.d.ts', 'tokens.d.ts', 'icons.d.ts'];

// Anything a consumer installs themselves is fair game to reference; anything
// else has to have been inlined.
const installable = new Set([
  ...Object.keys(pkg.peerDependencies ?? {}),
  ...Object.keys(pkg.dependencies ?? {}),
]);

const packageOf = (spec) =>
  spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];

export function verifyTypes() {
  const problems = [];

  for (const entry of ENTRIES) {
    const file = resolve(root, 'dist', entry);

    if (!existsSync(file)) {
      problems.push(`${entry} is missing`);
      continue;
    }

    const source = readFileSync(file, 'utf8');
    const specs = [...source.matchAll(/from\s+'([^']+)'/g)].map((m) => m[1]);

    if (specs.some((s) => s.startsWith('.'))) {
      problems.push(`${entry} still re-exports relative paths — the declaration rollup did not run`);
      continue;
    }

    for (const spec of new Set(specs.filter((s) => !installable.has(packageOf(s))))) {
      problems.push(`${entry} references "${spec}", which consumers do not install`);
    }
  }

  return problems;
}

// Also usable on its own, to check a dist built some other way.
if (import.meta.url === `file://${process.argv[1]}`) {
  const problems = verifyTypes();
  if (problems.length) {
    console.error('\x1b[31mDeclaration check failed:\x1b[0m');
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  console.log('\x1b[32mDeclarations are self-contained\x1b[0m');
}
