import type { Breakpoint } from './breakpoints';

/**
 * A responsive prop value — either a plain value applied at all breakpoints,
 * or an object mapping breakpoints to values (mobile-first, min-width).
 *
 * @example
 * direction="column"
 * direction={{ xs: 'column', lg: 'row' }}
 */
export type Responsive<T> = T | Partial<Record<Breakpoint, T>>;
