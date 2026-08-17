/**
 * Types for the shared layout props. Kept out of `layout.css.ts` because the
 * `.css.ts` modules are compiled away at build time and their declarations are
 * not emitted — a public type may not live in one.
 */

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
