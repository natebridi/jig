import { style } from '@vanilla-extract/css';

/**
 * Removes an element from view while leaving it in the accessibility tree —
 * for status messages and other text that only assistive technology needs.
 *
 * Internal: components use this for their own announcements rather than
 * exposing it as a layout primitive.
 */
export const visuallyHidden = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  padding: 0,
  overflow: 'hidden',
  // A zero-area rect rather than `display: none`, which would take the text
  // out of the accessibility tree along with the layout.
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
});
