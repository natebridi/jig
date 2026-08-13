import { execFileSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyTypes } from './verify-types.mjs';

/**
 * Generates the icons, builds, and refuses to finish until the emitted
 * declarations are actually self-contained.
 *
 * The rollup step races with itself across entry points and fails roughly half
 * the time, silently and with a zero exit code (see verify-types.mjs). Since
 * the failure is a race rather than anything about the source, re-running
 * clears it — so this retries rather than leaving a broken dist behind or
 * making every build a coin flip.
 */

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ATTEMPTS = 4;
const run = (cmd, args) => execFileSync(cmd, args, { cwd: root, stdio: 'inherit' });

run('node', ['scripts/generate-icons.mjs']);

for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
  rmSync(resolve(root, 'dist'), { recursive: true, force: true });

  // The race surfaces two ways: api-extractor throws over a temp file another
  // entry already deleted, or it quietly leaves the un-rolled declarations in
  // place and exits zero. Both are retryable, so a thrown build is an attempt
  // rather than the end of it.
  let crashed = false;
  try {
    run('pnpm', ['exec', 'vite', 'build']);
  } catch {
    crashed = true;
  }

  const problems = crashed ? ['the build itself failed'] : verifyTypes();
  if (problems.length === 0) {
    console.log(`\x1b[32mDeclarations verified\x1b[0m${attempt > 1 ? ` (attempt ${attempt})` : ''}`);
    process.exit(0);
  }

  console.warn(`\x1b[33mAttempt ${attempt} did not produce usable declarations:\x1b[0m`);
  for (const p of problems) console.warn(`  - ${p}`);
}

console.error(`\x1b[31mDeclarations were still not self-contained after ${ATTEMPTS} attempts.\x1b[0m`);
console.error('This is no longer the known rollup race — check the dts plugin output above.');
process.exit(1);
