import { describe, expect, it } from 'vitest';
import { merge, validateContext, validateParity, validateRequired } from './validate';

const token = (value: unknown) => ({ $type: 'color', $value: value });

/**
 * These check the checker. The token sources are widened with `as TokenSet`,
 * so validate.ts is the only thing standing between a typo in an alias and a
 * silently unstyled component — a validator that quietly passed everything
 * would be worse than none at all.
 */
describe('validateContext', () => {
  it('accepts a document whose aliases all resolve', () => {
    expect(validateContext('t', { color: { a: token('#fff'), b: token('{color.a}') } })).toEqual([]);
  });

  it('reports an alias that points at nothing', () => {
    expect(validateContext('t', { color: { a: token('{color.nope}') } }))
      .toEqual(['t: color.a aliases {color.nope}, which does not exist']);
  });

  it('reports an alias cycle instead of following it forever', () => {
    const problems = validateContext('t', {
      color: { a: token('{color.b}'), b: token('{color.a}') },
    });
    expect(problems).toHaveLength(2);
    expect(problems[0]).toMatch(/alias cycle/);
  });

  it('reports a token with no $type', () => {
    expect(validateContext('t', { color: { a: { $value: '#fff' } } }))
      .toEqual(['t: color.a has no $type']);
  });

  it('follows alias chains more than one step deep', () => {
    expect(
      validateContext('t', {
        color: { a: token('#fff'), b: token('{color.a}'), c: token('{color.b}') },
      })
    ).toEqual([]);
  });
});

describe('validateParity', () => {
  it('accepts themes with matching shapes', () => {
    expect(validateParity({ color: { a: token('#fff') } }, { color: { a: token('#000') } }))
      .toEqual([]);
  });

  it('reports a semantic present in only one theme', () => {
    expect(validateParity({ color: { a: token('#fff'), b: token('#eee') } }, { color: { a: token('#000') } }))
      .toEqual(['color.b is missing from the dark theme']);
  });
});

describe('validateRequired', () => {
  it('reports semantics the components rely on by name', () => {
    const problems = validateRequired('t', { color: { focus: token('#000') } });
    expect(problems).toContain('t: required semantic color.text.primary is missing');
    expect(problems.every((p) => !p.includes('color.focus'))).toBe(true);
  });
});

describe('merge', () => {
  it('lets a theme override a foundation token without dropping its siblings', () => {
    const merged = merge(
      { color: { a: token('#fff'), b: token('#eee') } },
      { color: { a: token('#000') } }
    );
    expect(merged).toEqual({ color: { a: token('#000'), b: token('#eee') } });
  });
});
