import { globalStyle, style } from '@vanilla-extract/css';

/**
 * An empty class to hang the defaults below on. The rules themselves are
 * attached through :where(), which contributes zero specificity — so any
 * more specific selector always wins, regardless of where its rules land in
 * the built stylesheet relative to this one. Button's recipe (button.css.ts)
 * uses this class to target icons rendered inside a button, for positioning
 * tweaks that belong there rather than on the icon in general.
 */
export const icon = style({});

globalStyle(`:where(.${icon})`, {
  // Phosphor's artwork is filled rather than stroked, so colour is a single
  // property and follows whatever the surrounding text is set to.
  fill: 'currentColor',
  display: 'inline-block',
  // Sits an icon on the text baseline instead of hanging it below.
  verticalAlign: '-0.125em',
  // Icons keep their size when placed in a Stack or a tight flex row.
  flexShrink: 0,
});
