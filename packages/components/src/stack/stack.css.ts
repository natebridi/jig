import { style } from '@vanilla-extract/css';

/**
 * Direction, gap and alignment all come from the shared layout sprinkles in
 * `../layout.css` — what is left here is only what every Stack has regardless
 * of its props.
 */
export const base = style({
  display: 'flex',
  position: 'relative',
  maxWidth: '100%',
  // Load-bearing now that a Stack can be a child of another Stack. A flex
  // item's automatic minimum size is its content, so a Stack holding a long
  // unbroken string refuses to shrink: measured at 1420px inside a 600px row
  // with no guard, and still 600px — the whole row, squeezing its siblings to
  // nothing — with `max-width: 100%` alone. Only `min-width: 0` lets it shrink.
  //
  // Note this does nothing when the parent is a Grid: every Jig Grid defines
  // its tracks as `minmax(0, 1fr)`, which already caps a child at its track.
  // The flex parent is the case that needs it.
  minWidth: 0,
});
