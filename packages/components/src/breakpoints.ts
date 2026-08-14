export const breakpoints = {
    xs: 0,
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1280,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// xs is the default (mobile-first base), so it has no media query.
// All other breakpoints use min-width queries.
export const mediaQueries = {
    sm: `screen and (min-width: ${breakpoints.sm}px)`,
    md: `screen and (min-width: ${breakpoints.md}px)`,
    lg: `screen and (min-width: ${breakpoints.lg}px)`,
    xl: `screen and (min-width: ${breakpoints.xl}px)`,
} as const;

/**
 * The Sprinkles conditions every responsive prop in the system is built from.
 * Shared so spacing and layout cannot drift into two different sets of
 * breakpoints, and so `Responsive<T>` describes all of them at once.
 */
export const responsiveConditions = {
    xs: {},
    sm: { '@media': mediaQueries.sm },
    md: { '@media': mediaQueries.md },
    lg: { '@media': mediaQueries.lg },
    xl: { '@media': mediaQueries.xl },
};

export const defaultCondition = 'xs';
