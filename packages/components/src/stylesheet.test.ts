import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';

/**
 * Structural assertions on the two published stylesheets.
 *
 * These are checked here rather than by rendering, because jsdom does not
 * implement cascade layers — the thing under test would be the one thing the
 * environment ignores.
 *
 * Requires `dist/`; the `test` task depends on `build`.
 */
const dist = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const ORDER = '@layer jig.reset, jig.tokens, jig.base, jig.components;';

let styles: string;
let reset: string;

beforeAll(() => {
  styles = readFileSync(resolve(dist, 'styles.css'), 'utf8');
  reset = readFileSync(resolve(dist, 'reset.css'), 'utf8');
});

describe('cascade layers', () => {
  it('declares the same layer order in both stylesheets', () => {
    // Layer order is fixed by first appearance, so both files must state it —
    // otherwise the cascade would depend on which one a consumer imports
    // first.
    expect(styles).toContain(ORDER);
    expect(reset).toContain(ORDER);
  });

  it('states the order before any rules that depend on it', () => {
    // Search past the order statement itself — it also begins "@layer jig.".
    const blockAfter = (css: string, layer: string) =>
      css.search(new RegExp(`@layer\\s+${layer.replace('.', '\\.')}\\s*\\{`));

    expect(styles.indexOf(ORDER)).toBeLessThan(blockAfter(styles, 'jig.tokens'));
    expect(reset.indexOf(ORDER)).toBeLessThan(blockAfter(reset, 'jig.reset'));
  });

  it('orders the reset below the components', () => {
    const order = ORDER.slice('@layer '.length, -1).split(',').map((s) => s.trim());
    expect(order.indexOf('jig.reset')).toBeLessThan(order.indexOf('jig.components'));
  });

  it('leaves no rule outside a layer, in either stylesheet', () => {
    // Regression: the reset shipped unlayered, which put it above *every*
    // layer including jig.components. Its `h1..h6, p { font-size: inherit }`
    // then silently flattened Typography's presets, so
    // `<Typography as="h1" with="heading01">` rendered at body size.
    const stripped = (css: string) =>
      css
        .replaceAll(ORDER, '')
        // Non-greedy would stop at the first inner `}` of the minified CSS,
        // so match the whole layer block through the last brace.
        .replace(/@layer\s+[\w.]+\s*\{[\s\S]*\}/g, '')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .trim();

    expect(stripped(styles), 'styles.css has unlayered rules').toBe('');
    expect(stripped(reset), 'reset.css has unlayered rules').toBe('');
  });
});
