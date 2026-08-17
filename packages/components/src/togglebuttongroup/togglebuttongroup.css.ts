import { styleVariants } from '@vanilla-extract/css';

/**
 * Deliberately close to nothing. Decision 0005 settled that there is no group
 * visual treatment yet — no shared border, no connected radius, no gap — so
 * this carries only what makes the group lay out at all, and the direction it
 * carries is the one `orientation` already declares to assistive technology.
 *
 * Callers wanting spacing pass a `className`, which is also how a segmented
 * treatment would arrive later without changing this file's contract.
 */
export const orientation = styleVariants({
  horizontal: { display: 'inline-flex', flexDirection: 'row' },
  vertical: { display: 'inline-flex', flexDirection: 'column' },
});
