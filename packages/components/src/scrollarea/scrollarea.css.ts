import { style } from "@vanilla-extract/css";
import { color, radius, spacing } from "@jig-ui/styles/tokens";
import { focusRing } from "../focus-ring";

/**
 * The width the scrollbar occupies, reserved whether or not it is painted.
 *
 * On the ratio ramp rather than an off-ramp constant: 0.45rem is 7.2px, which
 * lands in the usual 6-10px band for a drawn scrollbar. Decided in 0007.
 */
const gutter = spacing[300];

/**
 * How far the gradient mask ramps in from each edge. Clamped by the distance
 * actually scrolled, so it shortens to nothing at either end rather than
 * fading content that has nothing beyond it.
 */
const fade = "1.89rem"; // spacing[600]

/**
 * The viewport is what takes focus, but the focus ring is drawn on the root.
 *
 * A mask applies to everything the element paints, an outline included, so a
 * ring on the viewport would fade out at exactly the two edges the mask
 * touches — the focus indicator would be at its faintest where the mask is
 * strongest. Hoisting it to the unmasked root keeps it whole.
 */
export const viewport = style({
  // Not `height: 100%`. That resolves against a definite parent height, so a
  // caller who writes the natural thing — `style={{ maxHeight: '20rem' }}` —
  // gets a viewport sized to its content, no overflow, and a scroll area that
  // silently does not scroll. Filling a flex column instead works for a
  // max-height, a fixed height and a flex parent alike.
  flex: 1,
  // Load-bearing: a flex item's automatic minimum size is its content, so
  // without this the viewport refuses to shrink and there is still nothing to
  // scroll.
  minHeight: 0,
  // Decided in 0007 D1: the gutter is reserved unconditionally, so the body
  // does not reflow when the bar appears and the thumb never sits over the
  // text. Only the vertical axis reserves — see the note in `scrollbar`.
  paddingInlineEnd: gutter,
  // Decided in 0007 D2. `--scroll-area-overflow-y-start` and `-end` are pixel
  // distances Base UI publishes on this element, so the ramp collapses as each
  // end is reached. The scrollbar is a sibling rather than a child, so it is
  // not faded along with the content.
  maskImage: `linear-gradient(to bottom,
    transparent 0,
    black min(${fade}, var(--scroll-area-overflow-y-start, 0px)),
    black calc(100% - min(${fade}, var(--scroll-area-overflow-y-end, 0px))),
    transparent 100%)`,
  maskRepeat: "no-repeat",
  // The ring lives on the root; suppress the UA outline on the element that
  // actually receives focus.
  ":focus-visible": {
    outline: "none",
  },
});

export const root = style({
  // A flex column so the viewport can fill whatever constrains the root, see
  // the note there. Base UI sets `position: relative` inline, which the
  // absolutely-positioned scrollbars need.
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  minHeight: 0,
  selectors: {
    [`&:has(.${viewport}:focus-visible)`]: {
      ...focusRing[":focus-visible"],
    },
  },
});

/**
 * Painted only while the area is hovered, has focus within it, or is being
 * scrolled — 0007 D1, "nothing at rest".
 *
 * Hover and focus are CSS. Scroll is not: Base UI carries `scrolling` in the
 * scrollbar's state but its `stateAttributesMapping` does not emit it as a
 * data attribute on any element Jig styles against, so the component reads the
 * state through Base UI's function-form `className` instead. See `scrolling`
 * below.
 */
export const scrollbar = style({
  display: "flex",
  justifyContent: "center",
  opacity: 0,
  transition: "opacity 160ms ease",
  selectors: {
    [`.${root}:hover &`]: { opacity: 1 },
    // Base UI puts the viewport in the tab order whenever it overflows, so a
    // keyboard user can land inside a scroll region; they have to be able to
    // see what they landed in.
    [`.${root}:focus-within &`]: { opacity: 1 },
  },
});

/** Added by the component while Base UI reports the axis as scrolling. */
export const scrolling = style({
  opacity: 1,
});

/**
 * Only the vertical bar reserves space. Horizontal overflow is not a layout
 * Jig designs against yet (0007 §04), and reserving a strip along the bottom
 * of every scroll area for a bar that almost never appears costs more than the
 * reflow it would avoid.
 */
export const vertical = style({
  width: gutter,
});

export const horizontal = style({
  height: gutter,
});

export const thumb = style({
  width: "100%",
  height: "100%",
  borderRadius: radius[500],
  background: color.scrollbar.thumb,
  transition: "background 120ms ease",
  ":hover": {
    background: color.scrollbar.thumbHover,
  },
});
