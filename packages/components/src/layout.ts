/**
 * Types for the shared layout props. Kept out of `layout.css.ts` because the
 * `.css.ts` modules are compiled away at build time and their declarations are
 * not emitted — a public type may not live in one.
 */

/** Twelve is the whole grid. */
export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type LayoutAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type LayoutJustify = 'start' | 'center' | 'end' | 'between' | 'around';
export type LayoutDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type LayoutSpacing = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
