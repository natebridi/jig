import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';

/**
 * Contract tests on the generated stylesheet — invariants, not a snapshot.
 * Snapshotting 600 lines of generated CSS would fail on every token change and
 * tell you nothing about whether the *cascade* still works, which is the part
 * that actually breaks.
 *
 * Requires `dist/` — the `test` task depends on `build`.
 */
const dist = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');

let css: string;
beforeAll(() => {
  css = readFileSync(resolve(dist, 'tokens.css'), 'utf8');
});

const occurrences = (pattern: RegExp) => css.match(pattern)?.length ?? 0;

describe('theme selectors', () => {
  it('emits every theme entry point, symmetrically', () => {
    // Each selector appears once per colour-gamut context (sRGB plus the p3
    // and rec2020 overrides), so the invariant is that the three themes are
    // emitted the same number of times as each other — not that any of them
    // appears exactly once.
    const osDark = occurrences(/@media\s*\(\s*prefers-color-scheme:\s*dark\s*\)/g);
    const explicitLight = occurrences(/:root\[data-theme="light"\]\s*\{/g);
    const explicitDark = occurrences(/:root\[data-theme="dark"\]\s*\{/g);

    expect(osDark).toBeGreaterThan(0);
    expect(explicitLight).toBe(osDark);
    expect(explicitDark).toBe(osDark);
  });

  it('orders explicit themes after the OS preference', () => {
    // The attribute selectors only outrank the media query because they come
    // later *and* are more specific. Reordering would silently break
    // data-theme="light" on a dark-preference machine.
    const osDark = css.search(/@media\s*\(\s*prefers-color-scheme:\s*dark\s*\)/);
    const explicitLight = css.search(/:root\[data-theme="light"\]/);
    const explicitDark = css.search(/:root\[data-theme="dark"\]/);

    expect(osDark).toBeGreaterThan(-1);
    expect(explicitLight).toBeGreaterThan(osDark);
    expect(explicitDark).toBeGreaterThan(osDark);
  });

  it('re-declares in explicit-light everything the dark media query overrides', () => {
    // Otherwise `data-theme="light"` cannot beat `prefers-color-scheme: dark`,
    // and forcing light on a dark machine silently does nothing.
    const block = (pattern: RegExp) => {
      const start = css.search(pattern);
      return css.slice(start, css.indexOf('\n}', start));
    };
    const props = (text: string) => new Set(text.match(/--[\w-]+(?=\s*:)/g) ?? []);

    const darkProps = props(block(/@media\s*\(\s*prefers-color-scheme:\s*dark\s*\)/));
    const lightProps = props(block(/:root\[data-theme="light"\]/));

    for (const property of darkProps) expect(lightProps).toContain(property);
  });
});

describe('token graph', () => {
  it('declares the primitives only once', () => {
    // The whole point of the dedupe pass: primitives do not vary by theme, so
    // a second copy is dead weight in every consumer's bundle.
    expect(occurrences(/--color-blue-500\s*:/g)).toBe(1);
    expect(occurrences(/--spacing-500\s*:/g)).toBe(1);
  });

  it('resolves every var() reference it makes', () => {
    const declared = new Set(css.match(/--[\w-]+(?=\s*:)/g) ?? []);
    const referenced = new Set(
      [...css.matchAll(/var\(\s*(--[\w-]+)/g)].map((match) => match[1]!)
    );

    const dangling = [...referenced].filter((name) => !declared.has(name));
    expect(dangling).toEqual([]);
  });

  it('carries the semantics the components rely on', () => {
    for (const name of [
      '--color-focus',
      '--color-surfaces-body',
      '--color-surfaces-card',
      '--color-text-primary',
      '--color-text-muted',
      '--color-text-accent',
      '--color-text-danger',
    ]) {
      expect(css).toContain(`${name}:`);
    }
  });

  it('sets color-scheme for every theme entry point', () => {
    expect(css).toMatch(/color-scheme:\s*light dark/);
    expect(occurrences(/color-scheme:\s*dark/g)).toBeGreaterThanOrEqual(2);
  });
});
