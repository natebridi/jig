import { style } from '@vanilla-extract/css';

export const icon = style({
  // Phosphor's artwork is filled rather than stroked, so colour is a single
  // property and follows whatever the surrounding text is set to.
  fill: 'currentColor',
  display: 'inline-block',
  // Sits an icon on the text baseline instead of hanging it below.
  verticalAlign: '-0.125em',
  // Icons keep their size when placed in a Stack or a tight flex row.
  flexShrink: 0,
});
