import type { ElementType } from 'react';
import type { Breakpoint } from '../breakpoints';
import type { Responsive } from '../responsive';
import { splitSpacing, type SpacingProps } from '../spacing';
import { layoutSprinkles } from '../layout.css';
import { childLayout, type GridColumns, type LayoutAlign, type LayoutChildProps, type LayoutJustify, type LayoutSpacing } from '../layout';
import type { PolymorphicProps } from '../polymorphic';
import { base, distribute } from './grid.css';

/** The elements a Grid is willing to render as. See StackElement. */
export type GridElement =
  | 'div' | 'section' | 'article' | 'aside'
  | 'nav' | 'header' | 'footer' | 'main'
  | 'ul' | 'ol' | 'li';

export type { GridColumns };

/**
 * Grid's own props: how it arranges its children, plus the shared child-side
 * set describing how it sits in whatever contains it — a Grid nested in a Grid
 * claims a `span` of the outer one exactly as a Box does. The element's own
 * attributes are added by PolymorphicProps.
 */
export interface GridOwnProps extends SpacingProps, LayoutChildProps {
  spacing?: Responsive<LayoutSpacing>;
  /**
   * Distributes children evenly across the fixed 24-column grid — every child
   * that has not claimed a span of its own takes `24 / columns` tracks.
   *
   * Only the divisors of 24 are accepted, so the tracks always come out whole.
   * A `Box` with an explicit `span` overrides the distribution, and the two can
   * be mixed in one Grid.
   *
   * @example
   * <Grid columns={3}>            // three equal fields
   * <Grid columns={{ xs: 1, md: 3 }}>  // stacked on a phone
   */
  columns?: Responsive<GridColumns>;
  align?: Responsive<LayoutAlign>;
  justify?: Responsive<LayoutJustify>;
}

export type GridProps<E extends GridElement = 'div'> = PolymorphicProps<E, GridOwnProps>;

/**
 * Resolves the responsive `columns` value to the marker classes that carry the
 * distribution rules. One class per breakpoint the caller named.
 */
const distributionClasses = (columns: Responsive<GridColumns>): string[] =>
  typeof columns === 'number'
    ? [distribute.xs[`${columns}`]]
    : Object.entries(columns).map(
        ([breakpoint, value]) => distribute[breakpoint as Breakpoint][`${value as GridColumns}`]
      );

/**
 * A grid container.
 *
 * `columns` sets how many equal tracks the row is divided into — 1, 2, 3, 4, 6,
 * 8, 12 or 24, all of which divide the 24-column base evenly. Children claim
 * width with `span`, either through `Box` or directly on a nested Stack or
 * Grid.
 *
 * `spacing` is a step on the shared scale and applies in both directions.
 * `columns`, `spacing`, `align` and `justify` all take responsive values keyed
 * by breakpoint.
 *
 * Grid is also a layout child, so it takes `span`, `grow` and `alignSelf` for
 * its own position inside a parent.
 *
 * @example
 * <Grid columns={{ xs: 1, md: 12 }} spacing="500">
 *   <Box span={{ xs: 1, md: 8 }}><Article /></Box>
 *   <Box span={{ xs: 1, md: 4 }}><Sidebar /></Box>
 * </Grid>
 */
export function Grid<E extends GridElement = 'div'>({
  as,
  spacing: spacingProp = '300',
  // One column by default, so an unwrapped child fills the row rather than
  // taking a single 24th of it.
  columns = 1,
  align,
  justify,
  span,
  grow,
  alignSelf,
  className,
  children,
  ...props
}: GridProps<E>) {
  const { spacing, rest } = splitSpacing(props);
  // See Stack: widened for JSX only, the union is the public contract.
  const Component = (as ?? 'div') as ElementType;

  return (
    <Component
      className={[
        base,
        ...distributionClasses(columns),
        layoutSprinkles({
          gap: spacingProp,
          ...(align ? { alignItems: align } : {}),
          ...(justify ? { justifyContent: justify } : {}),
          ...childLayout({ span, grow, alignSelf }),
        }),
        spacing,
        className,
      ].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </Component>
  );
}
