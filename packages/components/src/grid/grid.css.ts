import { globalStyle, style } from '@vanilla-extract/css';
import { mediaQueries } from '../breakpoints';
import { GRID_COLUMNS, type GridColumns } from '../layout';
import type { Breakpoint } from '../breakpoints';

/**
 * The track definition is fixed and lives here rather than in a prop, so every
 * Grid in the system lays out on the same 24 columns. Two grids of the same
 * width therefore share column positions without `subgrid` or a shared
 * template — which is the property that makes a fixed count worth having.
 */
export const base = style({
  display: 'grid',
  gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))`,
  // `minmax(0, 1fr)` above caps this Grid's own children. This caps the Grid
  // itself once it is a child of a *Stack* — a flex item's automatic minimum
  // size is its content, so a Grid holding a long unbroken string would refuse
  // to shrink and take the whole row. Inside another Grid it is redundant,
  // since the parent's own `minmax(0, 1fr)` already caps it; it is cheap
  // enough to carry unconditionally rather than to reason about per parent.
  minWidth: 0,
});

/** The divisors of 24. See `GridColumns`. */
const DIVISORS = [1, 2, 3, 4, 6, 8, 12, 24] as const;

const BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

/**
 * `columns={n}` distributes: every child that has not claimed a span of its
 * own takes `24 / n` tracks.
 *
 * Done with a descendant rule rather than by cloning children, so it survives
 * fragments, `map`, and conditional children — none of which a clone-based
 * implementation handles. The `:where()` wrapper is what makes the precedence
 * rule work: it contributes zero specificity, so a Box carrying its own span
 * class always wins, and a Grid can mix distributed and explicit children.
 *
 * Declared in breakpoint order so that a larger breakpoint's rule follows a
 * smaller one in the stylesheet. The media queries do not add specificity, so
 * source order is what resolves `columns={{ xs: 1, md: 3 }}`.
 */
export const distribute = {} as Record<Breakpoint, Record<`${GridColumns}`, string>>;

for (const breakpoint of BREAKPOINTS) {
  distribute[breakpoint] = {} as Record<`${GridColumns}`, string>;

  for (const columns of DIVISORS) {
    // A marker class with no styles of its own; the rule it carries is the
    // global one below.
    const marker = style({});
    distribute[breakpoint][`${columns}`] = marker;

    const span = { gridColumn: `span ${GRID_COLUMNS / columns}` };

    globalStyle(
      `:where(.${marker}) > *`,
      breakpoint === 'xs' ? span : { '@media': { [mediaQueries[breakpoint]]: span } }
    );
  }
}
