import { style, styleVariants } from '@vanilla-extract/css';
import { spacing } from '@jig-ui/styles/tokens';
import { mediaQueries } from '../breakpoints';

export const base = style({ display: 'flex' });

// --- direction ---

const directionStyles = {
    row: { flexDirection: 'row' as const },
    column: { flexDirection: 'column' as const },
    'row-reverse': { flexDirection: 'row-reverse' as const },
    'column-reverse': { flexDirection: 'column-reverse' as const },
};

export const direction = {
    xs: styleVariants(directionStyles),
    sm: styleVariants(directionStyles, (s) => ({ '@media': { [mediaQueries.sm]: s } })),
    md: styleVariants(directionStyles, (s) => ({ '@media': { [mediaQueries.md]: s } })),
    lg: styleVariants(directionStyles, (s) => ({ '@media': { [mediaQueries.lg]: s } })),
    xl: styleVariants(directionStyles, (s) => ({ '@media': { [mediaQueries.xl]: s } })),
};

// --- spacing ---

const spacingStyles = {
    '100': { gap: spacing['100'] },
    '200': { gap: spacing['200'] },
    '300': { gap: spacing['300'] },
    '400': { gap: spacing['400'] },
    '500': { gap: spacing['500'] },
    '600': { gap: spacing['600'] },
    '700': { gap: spacing['700'] },
    '800': { gap: spacing['800'] },
    '900': { gap: spacing['900'] },
};

export const stackSpacing = {
    xs: styleVariants(spacingStyles),
    sm: styleVariants(spacingStyles, (s) => ({ '@media': { [mediaQueries.sm]: s } })),
    md: styleVariants(spacingStyles, (s) => ({ '@media': { [mediaQueries.md]: s } })),
    lg: styleVariants(spacingStyles, (s) => ({ '@media': { [mediaQueries.lg]: s } })),
    xl: styleVariants(spacingStyles, (s) => ({ '@media': { [mediaQueries.xl]: s } })),
};

// --- align ---

const alignStyles = {
    start: { alignItems: 'flex-start' as const },
    center: { alignItems: 'center' as const },
    end: { alignItems: 'flex-end' as const },
    stretch: { alignItems: 'stretch' as const },
    baseline: { alignItems: 'baseline' as const },
};

export const align = {
    xs: styleVariants(alignStyles),
    sm: styleVariants(alignStyles, (s) => ({ '@media': { [mediaQueries.sm]: s } })),
    md: styleVariants(alignStyles, (s) => ({ '@media': { [mediaQueries.md]: s } })),
    lg: styleVariants(alignStyles, (s) => ({ '@media': { [mediaQueries.lg]: s } })),
    xl: styleVariants(alignStyles, (s) => ({ '@media': { [mediaQueries.xl]: s } })),
};
