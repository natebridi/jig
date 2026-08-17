import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';
import { spacing } from '@jig-ui/styles/tokens';
import { responsiveConditions, defaultCondition } from './breakpoints';
import { GRID_COLUMNS, type GridSpan } from './layout';

const gap = {
  '100': spacing['100'],
  '200': spacing['200'],
  '300': spacing['300'],
  '400': spacing['400'],
  '500': spacing['500'],
  '600': spacing['600'],
  '700': spacing['700'],
  '800': spacing['800'],
  '900': spacing['900'],
};

/**
 * How many of the grid's 24 tracks a child occupies.
 *
 * This replaced a `gridTemplateColumns` set that enumerated twelve track
 * templates per breakpoint — sixty declarations for a prop that could only
 * ever produce equal columns, and so could not describe a single row of the
 * form that prompted the change. The track count is fixed now and lives on
 * Grid's base class, so the only thing worth generating is the span.
 */
const gridColumn = Object.fromEntries(
  Array.from({ length: GRID_COLUMNS }, (_, i) => [`${i + 1}`, `span ${i + 1}`])
) as Record<`${GridSpan}`, string>;

/**
 * The responsive layout properties Stack and Grid share. Previously each
 * component hand-generated one class per variant per breakpoint and resolved
 * them itself; Sprinkles already does exactly that, and doing it once here
 * keeps the two components from drifting apart.
 */
const layoutProperties = defineProperties({
  conditions: responsiveConditions,
  defaultCondition,
  properties: {
    flexDirection: ['row', 'column', 'row-reverse', 'column-reverse'],
    alignItems: {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      stretch: 'stretch',
      baseline: 'baseline',
    },
    justifyContent: {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      between: 'space-between',
      around: 'space-around',
    },
    gap,
    gridColumn,
    // Child-side props. `alignSelf` carries the weight that a changed Stack
    // default would otherwise have — with `align` still defaulting to `start`,
    // this is the only way a single child says it should fill.
    alignSelf: {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      stretch: 'stretch',
      baseline: 'baseline',
    },
    flexGrow: { '0': 0, '1': 1 },
  },
});

export const layoutSprinkles = createSprinkles(layoutProperties);
