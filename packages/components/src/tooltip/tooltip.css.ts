import { keyframes, style, styleVariants } from '@vanilla-extract/css';
import { color, radius, spacing, type } from '@jig-ui/styles/tokens';

const fadeIn = keyframes({
  from: { opacity: 0 },
});

/**
 * The trigger carries `anchor-name` and the bubble `position-anchor`, both set
 * inline to a dashed-ident unique to each Tooltip — so adjacent or nested
 * tooltips never resolve to each other's anchor.
 */
export const bubble = style({
  position: 'fixed',
  // Go with the trigger when it scrolls out of view, rather than hovering over
  // the spot it used to occupy.
  positionVisibility: 'anchors-visible',
  // The UA gives [popover] a centering inset and chrome of its own; the
  // position-area can only place the bubble once those are cleared.
  inset: 'auto',
  border: 'none',
  overflow: 'visible',
  // Also the closed state in browsers without the popover attribute, where the
  // UA's own [popover]:not(:popover-open) rule is absent.
  display: 'none',
  // So the max-width below is the width the bubble actually reaches, whether
  // or not the consumer imported the reset.
  boxSizing: 'border-box',
  margin: spacing[200],
  padding: `${spacing[200]} ${spacing[300]}`,
  width: 'max-content',
  maxWidth: '18rem',
  background: color.surfaces.inverse,
  color: color.text.inverse,
  borderRadius: radius[300],
  fontFamily: type.caption02.family,
  fontSize: type.caption02.size,
  fontWeight: type.caption02.weight,
  // The caption styles set line-height 1, which is meant for single-line
  // labels. Long content wraps, so take the body measure instead.
  lineHeight: type.body01.lineHeight,
  selectors: {
    '&:popover-open': {
      display: 'block',
      animationName: fadeIn,
      animationDuration: '120ms',
      animationTimingFunction: 'ease-out',
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      selectors: {
        '&:popover-open': { animationName: 'none' },
      },
    },
  },
});

export const placement = styleVariants({
  top: { positionArea: 'top center', positionTryFallbacks: 'flip-block' },
  bottom: { positionArea: 'bottom center', positionTryFallbacks: 'flip-block' },
  left: { positionArea: 'left center', positionTryFallbacks: 'flip-inline' },
  right: { positionArea: 'right center', positionTryFallbacks: 'flip-inline' },
});
