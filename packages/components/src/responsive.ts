import type { Breakpoint } from '@jig-ui/styles/breakpoints';

/**
 * A responsive prop value — either a plain value applied at all breakpoints,
 * or an object mapping breakpoints to values (mobile-first, min-width).
 *
 * @example
 * direction="column"
 * direction={{ xs: 'column', lg: 'row' }}
 */
export type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

/**
 * Resolves a responsive prop to a space-separated string of class names.
 *
 * @param value  The responsive prop value.
 * @param variants  An object keyed by breakpoint, each containing a map of
 *                  variant value → class name (as produced by styleVariants).
 *                  The `xs` key holds the base (no media query) classes.
 */
export function resolveResponsive<T extends string>(
    value: Responsive<T> | undefined,
    variants: { xs: Record<T, string> } & Partial<Record<Breakpoint, Record<T, string>>>
): string {
    if (value == null) return '';
    if (typeof value === 'string' || typeof value === 'number') return variants.xs[value] ?? '';
    return (Object.entries(value) as [Breakpoint, T][])
        .map(([bp, val]) => variants[bp]?.[val] ?? '')
        .filter(Boolean)
        .join(' ');
}
