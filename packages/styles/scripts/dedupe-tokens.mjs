import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Terrazzo emits the whole token graph once per permutation, so the generated
 * stylesheet carried a full copy of every primitive for each theme — none of
 * which vary by theme. This strips from the themed blocks anything the base
 * block already declares, leaving each themed block holding only the
 * properties that actually change.
 *
 * It only ever *deletes* whole custom-property declarations. Selectors,
 * at-rules, `color-scheme` and ordering are left exactly as Terrazzo produced
 * them.
 *
 * Comparison is per colour gamut, not global. A value that matches the base
 * only inside a `color-gamut` block is not redundant at the top level — on a
 * display that does not match that gamut, stripping it would silently fall
 * back to the base theme's value.
 */

const file = resolve(dirname(fileURLToPath(import.meta.url)), '../dist/tokens.css');

const DECLARATION = /^\s*--[\w-]+\s*:/;
const PROPERTY = /^\s*(--[\w-]+)\s*:/;
const GAMUT = /@media\s*\(\s*color-gamut:\s*([\w]+)\s*\)/;
const DARK_SCHEME = /@media\s*\(\s*prefers-color-scheme:\s*dark\s*\)/;
const EXPLICIT = /:root\[data-theme=["']?(light|dark)["']?\]/;
const ROOT = /(^|\s):root\s*[,{]/;

/**
 * Walks the stylesheet tracking which theme and colour gamut each line sits
 * in. Segmentation is structural rather than marker-based: Terrazzo rewrites
 * the string `prepare` returns, so anything injected there cannot be relied on
 * to survive into the output.
 */
function* walk(source) {
  const stack = [];
  let theme = 'base';
  let gamut = 'srgb';

  for (const line of source.split('\n')) {
    const opens = (line.match(/\{/g) ?? []).length;
    const closes = (line.match(/\}/g) ?? []).length;

    if (opens > 0) {
      const explicit = EXPLICIT.exec(line);
      const gamutMatch = GAMUT.exec(line);

      stack.push({ theme, gamut });
      if (gamutMatch) gamut = gamutMatch[1];
      else if (DARK_SCHEME.test(line)) theme = 'os-dark';
      else if (explicit) theme = `explicit-${explicit[1]}`;
      else if (ROOT.test(line) && theme === 'base') theme = 'base';
    }

    yield { line, theme, gamut };

    for (let i = 0; i < closes; i += 1) {
      const previous = stack.pop();
      if (previous) ({ theme, gamut } = previous);
    }
  }
}

export function dedupe(source) {
  // Put every closing brace that shares a line with a declaration onto its own
  // line, so removing a redundant declaration cannot take a brace with it.
  const normalised = source.replace(/;[ \t]*\}/g, ';\n}');

  const base = new Map();
  for (const { line, theme, gamut } of walk(normalised)) {
    if (theme !== 'base' || !DECLARATION.test(line)) continue;
    if (!base.has(gamut)) base.set(gamut, new Set());
    base.get(gamut).add(line.trim());
  }

  // The properties the OS-dark block *actually* overrides — the ones whose
  // dark value differs from the base, and so survive this pass.
  // `data-theme="light"` has to keep re-declaring exactly these, even though
  // they match the base: the dark media query still applies underneath it when
  // the OS is dark, and a light theme that declares nothing has nothing to
  // beat it with.
  const overriddenByDark = new Set();
  for (const { line, theme, gamut } of walk(normalised)) {
    if (theme !== 'os-dark' || !DECLARATION.test(line)) continue;
    if (base.get(gamut)?.has(line.trim())) continue;
    const property = PROPERTY.exec(line)?.[1];
    if (property) overriddenByDark.add(property);
  }

  let removed = 0;
  const kept = [];

  for (const { line, theme, gamut } of walk(normalised)) {
    const property = PROPERTY.exec(line)?.[1];
    const mustOutrankDarkMedia = theme === 'explicit-light' && overriddenByDark.has(property);

    const redundant =
      theme !== 'base' &&
      !mustOutrankDarkMedia &&
      DECLARATION.test(line) &&
      base.get(gamut)?.has(line.trim());

    if (redundant) removed += 1;
    else kept.push(line);
  }

  // A themed block whose declarations were all redundant leaves an empty rule
  // behind. Drop those, innermost first.
  let css = kept.join('\n');
  let previous;
  do {
    previous = css;
    css = css.replace(/^[^\n{}]*\{\s*\}[ \t]*$/gm, '');
  } while (css !== previous);

  return { css: `${css.replace(/\n{3,}/g, '\n\n').trim()}\n`, removed };
}

/**
 * Runs the pass over the generated stylesheet in place. Exported so the dev
 * watcher can reuse it — development used to run bare `tz build --watch`,
 * which skipped this entirely and let a token edit silently restore the full
 * duplicated output that the production build strips.
 */
export function dedupeFile(path = file) {
  const before = readFileSync(path, 'utf8');
  const { css, removed } = dedupe(before);

  if (removed === 0) {
    throw new Error(
      'Token dedupe removed nothing. Terrazzo\'s output shape has probably changed — ' +
      'check that the themed blocks still resolve to the selectors this script walks.'
    );
  }

  writeFileSync(path, css, 'utf8');
  return { removed, before: before.length, after: css.length };
}

// Only when run as a command — importing this module (tests, the dev watcher)
// must not rewrite anything as a side effect.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { removed, before, after } = dedupeFile();
  console.log(
    `Token CSS deduped: removed \x1b[32m${removed}\x1b[0m redundant declarations ` +
    `(${before} → ${after} bytes, ` +
    `${((1 - after / before) * 100).toFixed(0)}% smaller)`
  );
}
