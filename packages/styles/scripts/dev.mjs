import { spawnSync } from 'node:child_process';
import { existsSync, watchFile } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dedupeFile } from './dedupe-tokens.mjs';

/**
 * The development pipeline, kept identical to the production one.
 *
 * `dev` used to be bare `tz build --watch`, which meant Terrazzo's raw output
 * — every primitive re-declared once per theme — was what a token edit
 * produced locally, while `build` produced the deduped file. A component watch
 * rebuild then composed that undeduped stylesheet into the public styles.css,
 * so development and production disagreed about the artifact.
 *
 * This watches Terrazzo's *inputs* rather than its output on purpose. Watching
 * dist/tokens.css would fire on the rewrite this script performs, and the
 * dedupe pass throws when there is nothing left to remove.
 *
 * Inputs are watched by stat-polling (`watchFile`), not `fs.watch`. `fs.watch`
 * binds to an inode, and @jig-ui/tokens rebuilds by writing a staging
 * directory and then replacing `dist` wholesale — so the file this script
 * cares about is a *different* inode after every token edit. An `fs.watch`
 * handle on it goes dead at the first rebuild and never fires again, which
 * looks exactly like "the token change was noticed but nothing happened".
 * Polling compares stat output, so it survives the swap; it also survives
 * editors that save the config by writing a temp file and renaming over it.
 */
const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(here, '..');
const config = resolve(pkgRoot, 'src/terrazzo.config.ts');

const require = createRequire(import.meta.url);
const tokensFile = require.resolve('@jig-ui/tokens/resolver');

// Resolved rather than assumed to be on PATH: pnpm puts .bin on PATH for its
// own scripts, but this file also gets run directly.
const tz = resolve(pkgRoot, 'node_modules/.bin/tz');

function build() {
  const started = Date.now();
  const result = spawnSync(tz, ['build', '--config', config], {
    cwd: pkgRoot,
    stdio: ['ignore', 'inherit', 'inherit'],
  });

  if (result.status !== 0) {
    console.error('Terrazzo build failed; leaving the previous tokens.css in place.');
    return;
  }

  try {
    const { removed } = dedupeFile();
    console.log(`tokens.css rebuilt and deduped (${removed} redundant declarations) in ${Date.now() - started}ms`);
  } catch (error) {
    console.error(`Dedupe failed: ${error.message}`);
  }
}

build();

// Coalesce the burst a single rebuild produces, and give the directory swap
// time to land — mid-swap there is a window where the resolver does not exist.
let pending;
const schedule = () => {
  clearTimeout(pending);
  pending = setTimeout(() => {
    if (!existsSync(tokensFile)) {
      console.error(`Waiting: ${tokensFile} is missing — is @jig-ui/tokens mid-build?`);
      return;
    }
    build();
    // Longer than the poll interval, so two adjacent ticks can never schedule
    // two Terrazzo runs. A full run is ~1.5s; coalescing is worth 400ms.
  }, 400);
};

for (const target of [tokensFile, config]) {
  watchFile(target, { interval: 250 }, (current, previous) => {
    // `watchFile` fires on every poll tick for some platforms; compare the
    // stat fields that actually indicate a rewrite.
    if (current.mtimeMs === previous.mtimeMs && current.size === previous.size) return;
    schedule();
  });
}

console.log('Watching design tokens and the Terrazzo config…');
