import { createVar, style, styleVariants } from "@vanilla-extract/css";
import { color, radius, size, spacing, type } from "@jig-ui/styles/tokens";
import { focusRing } from "../focus-ring";

/**
 * The three measurements a size sets. Everything below reads them, so a size
 * variant is one place rather than three parallel recipes.
 */
const rowHeight = createVar();
const trackSize = createVar();
const thumbSize = createVar();

/** The pointer target around the thumb. WCAG 2.2 SC 2.5.8 asks for 24px at AA. */
const HIT_TARGET = "1.5rem";

export const root = style({
  display: "flex",
  flexDirection: "column",
  gap: spacing[200],
});

/**
 * Sizes drive the row height from `size.control`, so a slider lines up with
 * the Input above it and the Button beside it. The track and thumb scale
 * inside that row rather than defining it.
 */
export const sizes = styleVariants({
  sm: {
    vars: { [rowHeight]: size.control.sm, [trackSize]: "2px", [thumbSize]: "0.58rem" },
  },
  md: {
    vars: { [rowHeight]: size.control.md, [trackSize]: "2px", [thumbSize]: "0.72rem" },
  },
  lg: {
    vars: { [rowHeight]: size.control.lg, [trackSize]: "3px", [thumbSize]: "0.86rem" },
  },
});

export const label = style({
  fontFamily: `${type.family.sans}`,
  fontSize: `${type.scale[200]}`,
  fontWeight: `${type.weight[500]}`,
  lineHeight: 1.2,
  color: color.text.primary,
});

/** The row that holds the optional steppers and the track between them. */
export const row = style({
  display: "flex",
  alignItems: "center",
  gap: spacing[300],
});

export const control = style({
  position: "relative",
  flex: 1,
  minWidth: 0,
  height: rowHeight,
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  // The control is dragged, so the browser must not claim the gesture for
  // scrolling first.
  touchAction: "none",
  selectors: {
    [`${root}[data-disabled] &`]: { cursor: "not-allowed" },
  },
});

export const track = style({
  position: "relative",
  width: "100%",
  height: trackSize,
  borderRadius: radius[900],
  background: color.control.border,
  selectors: {
    [`${root}[data-disabled] &`]: { background: color.control.disabledBg },
  },
});

export const indicator = style({
  position: "absolute",
  height: "100%",
  borderRadius: radius[900],
  background: color.control.activeBorder,
  selectors: {
    // Disabled drops the fill to the track colour rather than dimming it. At a
    // 2px hairline a lightness shift left enabled and disabled nearly
    // indistinguishable, so the tell is the presence of the fill, not its
    // shade — recorded as an obligation in decision 0004 D1.
    [`${root}[data-disabled] &`]: { background: color.control.disabledBg },
  },
});

export const thumb = style({
  position: "absolute",
  width: thumbSize,
  height: thumbSize,
  borderRadius: radius[900],
  background: color.control.activeBorder,
  // The thumb is a mark rather than a field boundary, so it takes the shared
  // ring rather than the border highlight bordered controls use. The focusable
  // element is the input Base UI nests inside, hence `:has`.
  selectors: {
    "&:has(:focus-visible)": focusRing[":focus-visible"],
    [`${root}[data-disabled] &`]: { background: color.control.disabledText },
  },
  // A 0.72rem mark is 11.5px, well under the 24px minimum target. The pointer
  // area is grown with a pseudo-element rather than padding so the visible
  // mark stays the size the design calls for.
  "::after": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: HIT_TARGET,
    height: HIT_TARGET,
    borderRadius: radius[900],
  },
});

/**
 * The value readout, shown while the thumb is dragged or focused.
 *
 * Ours rather than Base UI's, so it follows the hand-rolled overlay rule from
 * decision 0001 D3: native CSS anchor positioning, no positioning library. The
 * anchor name is set inline per instance, so two sliders on a page never
 * resolve to each other's thumb.
 */
export const bubble = style({
  position: "fixed",
  positionArea: "top center",
  positionTryFallbacks: "flip-block",
  // Follows the thumb out of view rather than hanging over where it was.
  positionVisibility: "anchors-visible",
  display: "block",
  width: "max-content",
  margin: spacing[200],
  padding: `${spacing[100]} ${spacing[200]}`,
  background: color.surfaces.inverse,
  color: color.text.inverse,
  borderRadius: radius[300],
  fontFamily: `${type.caption02.family}`,
  fontSize: `${type.caption02.size}`,
  lineHeight: 1.2,
  // Never a pointer target — the thumb underneath it is.
  pointerEvents: "none",
  opacity: 0,
  visibility: "hidden",
  transition: "opacity 120ms ease-out",
  selectors: {
    // Visible while dragging, and whenever anything in the control has focus —
    // the thumb or either stepper. Decision 0004 D2 asked for "drag and focus";
    // `:focus-within` is what actually delivers it.
    //
    // This was `[data-focused]` first, which never matched: Base UI derives
    // that attribute from Field, and Slider is deliberately not inside one
    // (0004 §04). `:focus-within` depends on nothing but the DOM, and it covers
    // the steppers, which a thumb-only signal never would.
    [`${root}[data-dragging] &, ${root}:focus-within &`]: {
      opacity: 1,
      visibility: "visible",
    },
    [`${root}[data-disabled] &`]: { display: "none" },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": { transition: "none" },
  },
});

export const description = style({
  fontFamily: `${type.family.sans}`,
  fontSize: `${type.scale[100]}`,
  lineHeight: 1.4,
  color: color.text.muted,
});
