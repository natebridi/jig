import { style } from '@vanilla-extract/css';
import { color, radius, spacing, type } from '@jig-ui/styles/tokens';
import { focusRing } from '../focus-ring';
import { linkHoverFor } from '../link/link-hover.css';

export const root = style({
  boxSizing: 'border-box',
  background: color.surfaces.card,
  borderRadius: radius[400],
  // Keeps the code's scrollbar inside the rounded corners.
  overflow: 'hidden',
  // An unwrapped line gives the <pre> a min-content width as wide as the code
  // itself, which shrink-to-fit contexts (a Stack, a grid cell) would honour by
  // growing the block past its container. Clamping here keeps the overflow
  // inside the code area, where it scrolls.
  maxWidth: '100%',
});

export const bar = style({
  display: 'flex',
  alignItems: 'center',
  // Holds the copy button to the right whether or not there is a label.
  justifyContent: 'space-between',
  gap: spacing[300],
  ...linkHoverFor('secondary'),
  padding: `${spacing[400]} ${spacing[400]}`,
});

export const label = style({
  fontFamily: type.family.mono,
  fontSize: type.caption02.size,
  ...linkHoverFor('secondary'),
  // Long file paths give up their space to the copy button rather than
  // pushing it out of the bar.
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const pre = style({
  margin: 0,
  padding: `0 ${spacing[400]} ${spacing[400]}`,
  // The <pre> is focusable so keyboard users can scroll the overflow, which
  // means it needs the ring too.
  ...focusRing,
  overflowX: 'auto',
  whiteSpace: 'pre',
  fontFamily: type.family.mono,
  fontSize: type.body01.size,
  lineHeight: type.body01.lineHeight,
  color: color.text.primary,
});

export const code = style({
  fontFamily: 'inherit',
  fontSize: 'inherit',
});
