import { style } from '@vanilla-extract/css';

/**
 * Columns and gap come from the shared layout sprinkles in `../layout.css` —
 * what is left here is only what every Grid has regardless of its props.
 */
export const base = style({
  display: 'grid',
});
