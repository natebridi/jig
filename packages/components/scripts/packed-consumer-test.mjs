import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Installs the packed tarball into a throwaway project with no workspace links
 * and checks that it works the way an outside consumer would experience it.
 *
 * This is the test that catches the failures most likely to reach a real user:
 * an export map pointing at a file that isn't shipped, a declaration importing
 * a private workspace package, or a runtime import of something the consumer
 * never installed. None of those show up from inside the monorepo, where every
 * one of those packages happens to resolve.
 */

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FORBIDDEN = [/@jig-ui\/styles/, /@jig-ui\/tokens/, /@vanilla-extract/, /@phosphor-icons/];

const run = (cmd, args, cwd) =>
  execFileSync(cmd, args, { cwd, stdio: 'pipe', encoding: 'utf8' });

const problems = [];
const workspace = mkdtempSync(join(tmpdir(), 'jig-packed-'));

try {
  // 1. Pack exactly what would be published.
  process.stdout.write('Packing… ');
  run('npm', ['pack', '--pack-destination', workspace], root);
  const tarball = readdirSync(workspace).find((f) => f.endsWith('.tgz'));
  if (!tarball) throw new Error('npm pack produced no tarball');
  console.log(tarball);

  // 2. Install it into a project that knows nothing about the workspace.
  const app = join(workspace, 'app');
  mkdirSync(join(app, 'src'), { recursive: true });

  writeFileSync(
    join(app, 'package.json'),
    JSON.stringify({ name: 'jig-packed-consumer', private: true, version: '0.0.0', type: 'module' }, null, 2)
  );
  writeFileSync(
    join(app, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          strict: true, noEmit: true, jsx: 'react-jsx',
          module: 'ESNext', moduleResolution: 'bundler',
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          types: [],
          // Deliberately on: a consumer with strict settings should not be
          // tripped up by declarations we shipped.
          skipLibCheck: false,
        },
        include: ['src'],
      },
      null, 2
    )
  );
  writeFileSync(join(app, 'src', 'css.d.ts'), "declare module '*.css';\n");

  // Touches every export-map subpath, and a representative prop on each
  // component, so a broken entry point fails here rather than for a user.
  writeFileSync(
    join(app, 'src', 'app.tsx'),
    `import { Button, IconButton, ToggleButton, Stack, Grid, Typography, Adorn, Tooltip, CodeBlock } from '@jig-ui/react';
import { color, spacing } from '@jig-ui/react/tokens';
import { Icon } from '@jig-ui/react/icons';
import '@jig-ui/react/styles.css';
import '@jig-ui/react/reset.css';

export function App() {
  return (
    <Stack as="section" spacing={{ xs: '200', md: '500' }} style={{ maxWidth: '60rem', marginInline: 'auto' }}>
      <Typography as="h1" with="heading01" mb="400">Hello</Typography>
      <Grid columns={{ xs: 1, md: 3 }} spacing="300">
        <Button variant="primary" icon="check">Go</Button>
        <Tooltip content="Settings"><IconButton icon="gear" label="Settings" /></Tooltip>
        <ToggleButton isIconOnly icon="star" label="Favourite" />
      </Grid>
      <Typography as="p">An <Adorn as="strong" with="danger">urgent</Adorn> note.</Typography>
      {/* Element-correlated props: these only typecheck because \`as\` drives the prop set. */}
      <Typography as="label" htmlFor="field" with="body01">Labelled</Typography>
      <Stack as="ol" start={2}><li>correlated</li></Stack>
      <Adorn as="code" with="mono">mono</Adorn>
      <Icon icon="heart" label="Liked" />
      <CodeBlock label="app.tsx">{'const a = 1;'}</CodeBlock>
      <div style={{ background: color.surfaces.card, padding: spacing['500'] }} />
    </Stack>
  );
}
`
  );

  process.stdout.write('Installing tarball… ');
  run('npm', ['install', '--silent', '--no-audit', '--no-fund',
    join(workspace, tarball), 'react@^19', 'react-dom@^19',
    '@types/react@^19', '@types/react-dom@^19', 'typescript@^6'], app);
  console.log('done');

  // 3. Nothing beyond React should have come along for the ride.
  const installed = readdirSync(join(app, 'node_modules')).filter((n) => !n.startsWith('.'));
  for (const pattern of FORBIDDEN) {
    const leaked = installed.filter((name) => pattern.test(name));
    if (leaked.length) problems.push(`installed as a dependency: ${leaked.join(', ')}`);
  }

  // 4. A consumer's own typecheck must pass against the shipped declarations.
  process.stdout.write('Type-checking consumer… ');
  try {
    run('npx', ['tsc', '--noEmit', '-p', 'tsconfig.json'], app);
    console.log('clean');
  } catch (error) {
    console.log('failed');
    problems.push(`consumer typecheck failed:\n${error.stdout || error.message}`);
  }

  // 5. No shipped module may import something the consumer does not have.
  const pkgDir = join(app, 'node_modules', '@jig-ui', 'react');
  const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'));
  const allowed = new Set([
    ...Object.keys(pkg.peerDependencies ?? {}),
    ...Object.keys(pkg.dependencies ?? {}),
    'react/jsx-runtime',
  ]);

  for (const file of walk(pkgDir)) {
    if (!/\.(js|d\.ts)$/.test(file)) continue;
    // Strip comments first: rolldown leaves `//#region …/@vanilla-extract/…`
    // markers naming the chunks it inlined, which are not imports.
    const source = readFileSync(file, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');

    for (const [, spec] of source.matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)) {
      if (spec.startsWith('.')) continue;
      const owner = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
      if (!allowed.has(spec) && !allowed.has(owner)) {
        problems.push(`${file.slice(pkgDir.length + 1)} imports "${spec}", which consumers do not install`);
      }
    }
  }

  // 6. Both stylesheets must carry the layer contract, and the main one must
  //    resolve its own vars.
  const order = '@layer jig.reset, jig.tokens, jig.base, jig.components;';
  const css = readFileSync(join(pkgDir, 'dist', 'styles.css'), 'utf8');
  const resetCss = readFileSync(join(pkgDir, 'dist', 'reset.css'), 'utf8');

  if (!css.includes(order)) problems.push('styles.css does not declare the jig layer order');
  if (!resetCss.includes(order)) problems.push('reset.css does not declare the jig layer order');
  // Unlayered, the reset outranks every layer including jig.components, and
  // its h1..h6 rules flatten Typography's presets.
  if (!/@layer\s+jig\.reset\s*\{/.test(resetCss)) {
    problems.push('reset.css rules are not inside @layer jig.reset');
  }
  const declared = new Set(css.match(/--[\w-]+(?=\s*:)/g) ?? []);
  const dangling = [...new Set([...css.matchAll(/var\(\s*(--[\w-]+)/g)].map((m) => m[1]))]
    .filter((name) => !declared.has(name));
  if (dangling.length) problems.push(`styles.css references undeclared vars: ${dangling.join(', ')}`);
} finally {
  rmSync(workspace, { recursive: true, force: true });
}

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

if (problems.length) {
  console.error('\n\x1b[31mPacked consumer test failed:\x1b[0m');
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log('\n\x1b[32mPacked consumer test passed\x1b[0m — installs, type-checks and resolves in isolation');
