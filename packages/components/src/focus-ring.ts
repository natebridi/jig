import { color } from '@jig-ui/styles/tokens';

/**
 * The focus ring, as a style fragment components spread into their own rules.
 *
 * This used to be a bare `:focus-visible { … }` in the base stylesheet, which
 * restyled focus for *every* focusable element in the consuming app — links,
 * inputs and buttons that have nothing to do with Jig. Carrying it on the
 * components means importing Jig styles no longer silently changes how the
 * rest of the host application looks.
 */
export const focusRing = {
  ':focus-visible': {
    outline: `2px solid ${color.focus}`,
    outlineOffset: '2px',
  },
} as const;
