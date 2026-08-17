import { style } from '@vanilla-extract/css';

/**
 * Span, grow and self-alignment all come from the shared layout sprinkles in
 * `../layout.css` — what is left here is only what every Box has regardless of
 * its props.
 *
 * `minWidth: 0` is the whole of it, and it is load-bearing: a grid or flex
 * child's automatic minimum size is its content, so without this a long
 * unbroken string pushes a track wider than its share and the row overflows.
 */
export const base = style({
  minWidth: 0,
});
