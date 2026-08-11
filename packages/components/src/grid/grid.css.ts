import { style, styleVariants } from '@vanilla-extract/css';
import { spacing } from '@jig-ui/styles/tokens';
import { mediaQueries } from '../breakpoints';

export const base = style({ 
    display: 'grid',
    outline: '1px solid red',
});

// --- columns ---

const columnStyles = new Array(12).fill(0).reduce((acc, _, i) => ({ 
    ...acc, 
    [`${i + 1}`]: { gridTemplateColumns: `repeat(${i + 1}, minmax(0, 1fr))` } 
}), {})

export const gridColumns = {
    xs: styleVariants(columnStyles),
    sm: styleVariants(columnStyles, (s) => ({ '@media': { [mediaQueries.sm]: s } })),
    md: styleVariants(columnStyles, (s) => ({ '@media': { [mediaQueries.md]: s } })),
    lg: styleVariants(columnStyles, (s) => ({ '@media': { [mediaQueries.lg]: s } })),
    xl: styleVariants(columnStyles, (s) => ({ '@media': { [mediaQueries.xl]: s } })),
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

export const gridSpacing = {
    xs: styleVariants(spacingStyles),
    sm: styleVariants(spacingStyles, (s) => ({ '@media': { [mediaQueries.sm]: s } })),
    md: styleVariants(spacingStyles, (s) => ({ '@media': { [mediaQueries.md]: s } })),
    lg: styleVariants(spacingStyles, (s) => ({ '@media': { [mediaQueries.lg]: s } })),
    xl: styleVariants(spacingStyles, (s) => ({ '@media': { [mediaQueries.xl]: s } })),
};