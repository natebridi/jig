import { style } from '@vanilla-extract/css';

/**
 * Direction, gap and alignment all come from the shared layout sprinkles in
 * `../layout.css` — what is left here is only what every Stack has regardless
 * of its props.
 */
export const base = style({
  display: 'flex',
  maxWidth: '100%',
});
