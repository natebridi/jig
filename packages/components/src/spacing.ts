import { spacingSprinkles } from './spacing.css';

/**
 * Margin props shared by every component that accepts them. Spread into a
 * component's props interface rather than redeclared, so the set only ever
 * grows in one place.
 *
 * @example
 * <Typography mb="500">Heading</Typography>
 * <Typography mb={{ xs: '300', md: '500' }}>Heading</Typography>
 */
export type SpacingProps = Parameters<typeof spacingSprinkles>[0];

const spacingKeys = spacingSprinkles.properties as Set<string>;

/**
 * Splits the margin props out of a component's props, returning the class name
 * they compile to alongside everything left over for the DOM element. Keeps
 * spacing support to two lines per component instead of a duplicated prop
 * table.
 */
export function splitSpacing<P extends object>(props: P) {
  const spacingProps: Record<string, unknown> = {};
  const rest: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (spacingKeys.has(key)) spacingProps[key] = value;
    else rest[key] = value;
  }

  return {
    spacing: spacingSprinkles(spacingProps as SpacingProps),
    rest: rest as Omit<P, keyof SpacingProps>,
  };
}
