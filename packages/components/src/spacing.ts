import type { Responsive } from './responsive';
import { spacingSprinkles } from './spacing.css';

type AllSpacingProps = Parameters<typeof spacingSprinkles>[0];

const shorthandSpacingKeys = [
  'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml',
  'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl',
] as const;

/** The step scale margin and padding props share with Stack/Grid's `spacing`, plus an explicit `none` for clearing one something else already set. */
export type SpacingScale = 'none' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

/**
 * Margin and padding props shared by every component that accepts them.
 * Shorthand only — `mt`, `pr`, and so on. The longhand `marginTop` etc. that
 * the sprinkles config needs internally to build those shorthands isn't part
 * of the public surface. Spread into a component's props interface rather
 * than redeclared, so the set only ever grows in one place.
 *
 * Declared by hand against `SpacingScale` rather than derived from the
 * sprinkles function's inferred parameter type, so tooling that reads these
 * types — Storybook's props table included — sees a plain scale instead of
 * Sprinkles' generated conditional-style type.
 *
 * @example
 * <Typography mb="500">Heading</Typography>
 * <Typography mb={{ xs: '300', md: '500' }}>Heading</Typography>
 * <Stack p="400">...</Stack>
 */
export type SpacingProps = {
  [K in typeof shorthandSpacingKeys[number]]?: Responsive<SpacingScale>;
};

const spacingKeys = new Set<string>(shorthandSpacingKeys);

/**
 * Splits the margin/padding props out of a component's props, returning the
 * class name they compile to alongside everything left over for the DOM
 * element. Keeps spacing support to two lines per component instead of a
 * duplicated prop table.
 */
export function splitSpacing<P extends object>(props: P) {
  const spacingProps: Record<string, unknown> = {};
  const rest: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (spacingKeys.has(key)) spacingProps[key] = value;
    else rest[key] = value;
  }

  return {
    spacing: spacingSprinkles(spacingProps as AllSpacingProps),
    rest: rest as Omit<P, keyof SpacingProps>,
  };
}
