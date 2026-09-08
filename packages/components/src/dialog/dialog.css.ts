import { style, styleVariants } from "@vanilla-extract/css";
import { color, elevation, radius, size, spacing, type } from "@jig-ui/styles/tokens";
import { focusRing } from "../focus-ring";
import { linkHoverFor } from "../link/link-hover.css";
import { gutter as scrollGutter } from "../scrollarea/scrollarea.css";

/**
 * The margin a dialog keeps from the edge of the screen. Applied as padding on
 * the viewport rather than subtracted from the popup's width, so `100vw` never
 * appears — that unit includes the classic scrollbar's width and would make a
 * dialog overflow the very screens the cap exists to protect.
 */
const edgeGap = spacing[500];

/** The size of the close button's square. */
const closeSize = "1.75rem";

export const backdrop = style({
  position: "fixed",
  inset: 0,
  // The one literal colour in the token layer; an alias cannot carry alpha.
  // Decided in 0008 D2.
  background: color.surfaces.scrim,
});

/**
 * Positioning only. 0008 D3 chose inside-scroll, so this never becomes a
 * scroller — the ScrollArea in the panel does that, and the title and actions
 * stay put.
 */
export const viewport = style({
  position: "fixed",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: edgeGap,
});

/**
 * The positioning box, deliberately without a surface of its own.
 *
 * 0008 D1's note: the visible frame is the panel below, so anything that has
 * to sit *outside* the frame — the close button at `closePlacement="outside"`
 * — can be a sibling of the panel and still be inside this box. Hence
 * `overflow: visible` here and the clipping on the panel.
 */
export const popup = style({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  maxHeight: "100%",
  minHeight: 0,
  overflow: "visible",
});

/**
 * Reserves a strip above the panel for a close button placed outside it.
 *
 * The alternative — hanging the button off the panel's corner with a negative
 * offset — puts it past the edge of the screen as soon as the dialog is wider
 * than the viewport allows, which on a phone is always. Making the popup taller
 * means the button has somewhere to be at every width.
 */
export const popupOutsideClose = style({
  paddingBlockStart: `calc(${closeSize} + ${spacing[200]})`,
});

export const sizes = styleVariants({
  sm: { width: `min(${size.dialog.sm}, 100%)` },
  md: { width: `min(${size.dialog.md}, 100%)` },
  lg: { width: `min(${size.dialog.lg}, 100%)` },
});

/** The visible frame. Everything a reader would call "the dialog". */
export const panel = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxHeight: "100%",
  minHeight: 0,
  background: color.surfaces.card,
  borderRadius: radius[600],
  // `hi` — the layer that has taken over the screen. The ramp is themed: the
  // same alpha that lifts a card off white is invisible on a dark page, so the
  // dark context carries roughly four times the opacity at the same geometry.
  boxShadow: elevation.hi,
  // Clips the scroll region's corners; the popup stays visible so an outside
  // close button is not cut off by this.
  overflow: "hidden",
});

export const header = style({
  flex: "none",
  display: "flex",
  flexDirection: "column",
  gap: spacing[100],
  padding: `${spacing[500]} ${spacing[500]} ${spacing[400]}`,
});

/** Reserves room for a close button sitting over the header's trailing corner. */
export const headerInsetForClose = style({
  paddingInlineEnd: `calc(${spacing[500]} + ${closeSize} + ${spacing[300]})`,
});

export const title = style({
  fontFamily: `${type.family.sans}`,
  fontSize: `${type.scale[300]}`,
  fontWeight: `${type.weight[600]}`,
  lineHeight: 1.25,
  color: color.text.primary,
  margin: 0,
});

export const description = style({
  fontFamily: `${type.family.sans}`,
  fontSize: `${type.scale[200]}`,
  lineHeight: 1.45,
  // A description is prose and routinely carries a link ("see our terms"), so
  // it declares the hover pair for `secondary` rather than leaving a link
  // inside it to fall back to primary's.
  ...linkHoverFor('secondary'),
  margin: 0,
});

/**
 * The body. A ScrollArea (0007) rather than a plain overflow region, so a long
 * dialog scrolls between the pinned header and actions with the mask marking
 * the crop.
 */
export const body = style({
  flex: 1,
  minHeight: 0,
  // The trailing padding is short by the scrollbar gutter ScrollArea reserves
  // unconditionally (0007 D1). Without this the body's content sits 7.2px
  // off-centre in every dialog, scrolling or not. Read from ScrollArea rather
  // than restated, so the two cannot drift.
  paddingInline: `${spacing[500]} calc(${spacing[500]} - ${scrollGutter})`,
  fontFamily: `${type.family.sans}`,
  fontSize: `${type.scale[300]}`,
  lineHeight: 1.55,
  color: color.text.primary,
});

/** Padding is on the body, so a dialog with no header needs the top back. */
export const bodyNoHeader = style({
  paddingBlockStart: spacing[500],
});

/** And one with no actions needs the bottom. */
export const bodyNoActions = style({
  paddingBlockEnd: spacing[500],
});

export const actions = style({
  flex: "none",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "flex-end",
  gap: spacing[300],
  padding: `${spacing[400]} ${spacing[500]} ${spacing[500]}`,
});

const closeBase = style({
  position: "absolute",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: closeSize,
  height: closeSize,
  padding: 0,
  border: "none",
  borderRadius: radius[400],
  background: "transparent",
  color: color.text.secondary,
  cursor: "pointer",
  ...focusRing,
  ":hover": {
    background: color.button.ghost.hoverBg,
    color: color.text.primary,
  },
});

/**
 * Both placements are a sibling of the panel positioned against the popup —
 * one structure, two offsets. 0008 D1's note asked for the outside option; the
 * inside one is the default and the common case.
 */
export const close = styleVariants({
  inside: [
    closeBase,
    {
      insetBlockStart: spacing[400],
      insetInlineEnd: spacing[400],
    },
  ],
  outside: [
    closeBase,
    {
      // Sits in the strip `popupOutsideClose` reserves, above the frame.
      insetBlockStart: 0,
      insetInlineEnd: 0,
      // On the scrim rather than on the panel, so it carries its own surface.
      // Not `text.inverse`: that flips with the theme, and the scrim is dark in
      // both — an inverted foreground would vanish against it in dark mode.
      background: color.surfaces.card,
      borderRadius: radius[900],
      ":hover": {
        background: color.surfaces.card,
        color: color.text.primary,
      },
    },
  ],
});
