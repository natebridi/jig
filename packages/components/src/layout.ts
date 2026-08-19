/**
 * Types for the shared layout props, and the one conversion both containers
 * and Box need. Kept out of `layout.css.ts` because the `.css.ts` modules are
 * compiled away at build time and their declarations are not emitted — a
 * public type may not live in one.
 */
import type { Breakpoint } from './breakpoints';
import type { Responsive } from './responsive';

/**
 * Twenty-four is the whole grid, and it is fixed — a Grid always lays out on
 * the same 24 tracks, so two grids of the same width share column positions
 * without a shared template. Children say how much of it they occupy.
 *
 * Decided in apps/docs/decisions/0003-layout-children.html.
 */
export type GridSpan =
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24;

/**
 * The column counts a Grid can distribute its children across — the divisors
 * of 24, and nothing else. `columns={5}` would need tracks of 4.8, so it is a
 * type error rather than a silent rounding.
 */
export type GridColumns = 1 | 2 | 3 | 4 | 6 | 8 | 12 | 24;

/** The number of tracks in the grid. */
export const GRID_COLUMNS = 24;

export type LayoutAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type LayoutJustify = 'start' | 'center' | 'end' | 'between' | 'around';
export type LayoutDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type LayoutSpacing = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

/**
 * The props that describe how a component sits inside its parent, rather than
 * how it arranges its own children.
 *
 * Every layout primitive carries all three, because every layout primitive can
 * be a child of any other — a Grid nested in a Grid, a Stack inside a Stack, a
 * Box in either. Which of them does anything depends on the parent: `span`
 * applies inside a Grid, `grow` inside a Stack, `alignSelf` in either. A prop
 * that does not apply is inert rather than an error, which is the same
 * contract `Box` has had since 0003.
 *
 * Deliberately not on content components. Button and Input still get their
 * position from a layout wrapper; this is the line 0003 drew and it has not
 * moved — what changed is that the containers are on the child side of it too.
 */
export interface LayoutChildProps {
  /**
   * How many of a parent Grid's 24 columns to occupy. Overrides the
   * distribution the Grid set with `columns`.
   *
   * @example
   * <Grid columns={3}>
   *   <Stack span={16}>...</Stack>
   *   <Box span={8}>...</Box>
   * </Grid>
   */
  span?: Responsive<GridSpan>;
  /** Take the space left over by siblings. Only meaningful inside a Stack. */
  grow?: Responsive<boolean>;
  /**
   * Override the parent's `align` for this child alone. Works in both Stack
   * and Grid.
   *
   * Stack's `align` defaults to `start`, so this is how a single child says it
   * should fill the cross axis without changing the whole row. Note the pair
   * on a container: `align` is what it does to its children, `alignSelf` is
   * what it does to itself.
   */
  alignSelf?: Responsive<LayoutAlign>;
}

/** Sprinkles keys its span values by string; the prop reads better as a number. */
export const toSpanKey = (value: Responsive<GridSpan>): Responsive<`${GridSpan}`> =>
  typeof value === 'number'
    ? (`${value}` as `${GridSpan}`)
    : (Object.fromEntries(
        Object.entries(value).map(([breakpoint, v]) => [breakpoint, `${v}`])
      ) as Partial<Record<Breakpoint, `${GridSpan}`>>);

/** Sprinkles keys its values by string; `grow` reads better as a boolean. */
export const toGrowKey = (value: Responsive<boolean>): Responsive<'0' | '1'> =>
  typeof value === 'boolean'
    ? value ? '1' : '0'
    : (Object.fromEntries(
        Object.entries(value).map(([breakpoint, v]) => [breakpoint, v ? '1' : '0'])
      ) as Partial<Record<Breakpoint, '0' | '1'>>);

/**
 * `LayoutChildProps` with every key present and possibly undefined, which is
 * what the props look like once a component has destructured them. The
 * optional form would be rejected under `exactOptionalPropertyTypes`.
 */
type ChildLayoutValues = { [K in keyof LayoutChildProps]-?: LayoutChildProps[K] | undefined };

/**
 * The child-side props as arguments for `layoutSprinkles`, so each primitive
 * folds them into the single sprinkles call it already makes rather than
 * emitting a second class string.
 *
 * Returned as an argument fragment rather than a class name to keep this
 * module free of a dependency on `layout.css.ts`.
 */
export const childLayout = ({ span, grow, alignSelf }: ChildLayoutValues) => ({
  ...(span !== undefined ? { gridColumn: toSpanKey(span) } : {}),
  ...(grow !== undefined ? { flexGrow: toGrowKey(grow) } : {}),
  ...(alignSelf ? { alignSelf } : {}),
});
