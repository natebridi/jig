import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';
import { spacing } from '@jig-ui/styles/tokens';
import { mediaQueries } from './breakpoints';

/**
 * The same steps Stack and Grid expose as `spacing`, plus an explicit zero for
 * clearing a margin something else already set.
 */
const scale = {
  none: '0',
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

const marginProperties = defineProperties({
  // The same mobile-first breakpoints as Responsive<T>, so `mb="300"` applies
  // everywhere and `mb={{ xs: '200', md: '400' }}` steps up from md.
  conditions: {
    xs: {},
    sm: { '@media': mediaQueries.sm },
    md: { '@media': mediaQueries.md },
    lg: { '@media': mediaQueries.lg },
    xl: { '@media': mediaQueries.xl },
  },
  defaultCondition: 'xs',
  // Margin only. Padding is a component's own business — Button's padding *is*
  // its size variant — so it isn't offered here.
  properties: {
    marginTop: scale,
    marginRight: scale,
    marginBottom: scale,
    marginLeft: scale,
  },
  shorthands: {
    m: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
    mx: ['marginLeft', 'marginRight'],
    my: ['marginTop', 'marginBottom'],
    mt: ['marginTop'],
    mr: ['marginRight'],
    mb: ['marginBottom'],
    ml: ['marginLeft'],
  },
});

export const spacingSprinkles = createSprinkles(marginProperties);
