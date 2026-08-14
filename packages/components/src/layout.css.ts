import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';
import { spacing } from '@jig-ui/styles/tokens';
import { responsiveConditions, defaultCondition } from './breakpoints';
import type { GridColumns } from './layout';

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
 * Twelve is the whole grid, so the columns are enumerated rather than left
 * open — a value outside the set is a mistake worth a type error rather than a
 * class name that silently does not exist.
 */
const gridTemplateColumns = Object.fromEntries(
  Array.from({ length: 12 }, (_, i) => [`${i + 1}`, `repeat(${i + 1}, minmax(0, 1fr))`])
) as Record<`${GridColumns}`, string>;

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
    gridTemplateColumns,
  },
});

export const layoutSprinkles = createSprinkles(layoutProperties);
