import { describe, expect, it } from 'vitest';
// @ts-expect-error — plain .mjs build script, no declarations and none wanted.
import { dedupe } from '../scripts/dedupe-tokens.mjs';

/**
 * Direct tests for the token dedupe pass.
 *
 * The pass is line-based rather than AST-based, which makes its edge cases
 * worth pinning down explicitly: it is the one step that rewrites generated
 * CSS, and the only production check on it is that it removed *something*.
 * These cover the shapes where a naive line walker would get it wrong.
 */

const declarations = (css: string) =>
  css.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('--'));

describe('token dedupe', () => {
  it('strips themed declarations the base block already makes', () => {
    const { css, removed } = dedupe(`
:root {
  --color-red: #f00;
  --color-bg: #fff;
}
:root[data-theme="dark"] {
  --color-red: #f00;
  --color-bg: #000;
}
`);

    expect(removed).toBe(1);
    expect(css).toContain('--color-bg: #000');
    // The invariant primitive is declared once, in the base block only.
    expect(declarations(css).filter((d) => d.startsWith('--color-red:'))).toHaveLength(1);
  });

  it('keeps values that match the base only inside a different colour gamut', () => {
    // --brand matches the base *at the top level* but the base's p3 value is
    // different, so stripping it from the p3 themed block would silently fall
    // back to the sRGB value on a p3 display.
    const { css } = dedupe(`
:root {
  --brand: #123456;
}
@media (color-gamut: p3) {
  :root {
    --brand: color(display-p3 0 0 1);
  }
}
:root[data-theme="dark"] {
  --brand: #123456;
}
@media (color-gamut: p3) {
  :root[data-theme="dark"] {
    --brand: #123456;
  }
}
`);

    // Exactly one dark block survives, and it is the p3 one — the sRGB block
    // matched the sRGB base and was dropped whole.
    expect(css.match(/\[data-theme="dark"\]/g)).toHaveLength(1);
    const dark = css.slice(css.indexOf('[data-theme="dark"]'));
    expect(dark).toContain('--brand: #123456');
    expect(css.slice(0, css.indexOf('[data-theme="dark"]'))).toContain('color-gamut: p3');
  });

  it('keeps explicit-light declarations that the dark media query overrides', () => {
    // data-theme="light" must re-declare anything dark actually changes, even
    // though it matches the base: the dark media query still applies
    // underneath it when the OS is dark.
    const { css } = dedupe(`
:root {
  --bg: #fff;
  --radius: 4px;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #000;
    --radius: 4px;
  }
}
:root[data-theme="light"] {
  --bg: #fff;
  --radius: 4px;
}
`);

    const light = css.slice(css.indexOf('[data-theme="light"]'));
    expect(light).toContain('--bg: #fff');
    // --radius is invariant, so the light block has nothing to beat.
    expect(light).not.toContain('--radius');
  });

  it('does not swallow a closing brace shared with a declaration', () => {
    const { css } = dedupe(`
:root { --a: 1; --b: 2; }
:root[data-theme="dark"] { --a: 1; --b: 3; }
`);

    // Braces must still balance, or every downstream rule is inside the wrong block.
    expect((css.match(/\{/g) ?? []).length).toBe((css.match(/\}/g) ?? []).length);
    expect(css).toContain('--b: 3');
  });

  it('drops a themed block left empty, without disturbing its neighbours', () => {
    const { css } = dedupe(`
:root {
  --a: 1;
}
:root[data-theme="dark"] {
  --a: 1;
}
:root[data-theme="light"] {
  --a: 1;
}
`);

    expect(css).not.toContain('data-theme="dark"');
    expect(css).not.toContain('data-theme="light"');
    expect(css).toContain('--a: 1');
    expect((css.match(/\{/g) ?? []).length).toBe((css.match(/\}/g) ?? []).length);
  });

  it('leaves a nested at-rule balanced when its inner block empties out', () => {
    const { css } = dedupe(`
:root {
  --a: 1;
}
@media (prefers-color-scheme: dark) {
  :root {
    --a: 1;
  }
}
:root[data-theme="dark"] {
  --a: 2;
}
`);

    expect((css.match(/\{/g) ?? []).length).toBe((css.match(/\}/g) ?? []).length);
    expect(css).toContain('--a: 2');
  });

  it('treats a differently formatted equal value as a real override', () => {
    // Comparison is textual, so `#fff` and `#FFFFFF` are not recognised as the
    // same colour. That is the safe direction to be wrong in — it keeps a
    // redundant declaration rather than dropping a meaningful one — and this
    // pins the behaviour so a future change to normalise values is deliberate.
    const { css } = dedupe(`
:root {
  --bg: #fff;
}
:root[data-theme="dark"] {
  --bg: #FFFFFF;
}
`);

    expect(css).toContain('--bg: #FFFFFF');
  });

  it('reports nothing removed when every themed value genuinely differs', () => {
    const { removed } = dedupe(`
:root {
  --a: 1;
}
:root[data-theme="dark"] {
  --a: 2;
}
`);

    expect(removed).toBe(0);
  });
});
