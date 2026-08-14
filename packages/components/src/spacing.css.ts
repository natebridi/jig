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

const spacingProperties = defineProperties({
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
  // Margin and padding, on the same scale. Button is still the exception —
  // its padding *is* its size variant, so it doesn't take these.
  properties: {
    marginTop: scale,
    marginRight: scale,
    marginBottom: scale,
    marginLeft: scale,
    paddingTop: scale,
    paddingRight: scale,
    paddingBottom: scale,
    paddingLeft: scale,
  },
  shorthands: {
    m: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
    mx: ['marginLeft', 'marginRight'],
    my: ['marginTop', 'marginBottom'],
    mt: ['marginTop'],
    mr: ['marginRight'],
    mb: ['marginBottom'],
    ml: ['marginLeft'],
    p: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
    px: ['paddingLeft', 'paddingRight'],
    py: ['paddingTop', 'paddingBottom'],
    pt: ['paddingTop'],
    pr: ['paddingRight'],
    pb: ['paddingBottom'],
    pl: ['paddingLeft'],
  },
});

export const spacingSprinkles = createSprinkles(spacingProperties);
