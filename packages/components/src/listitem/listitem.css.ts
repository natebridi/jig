import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { color, radius, spacing, type } from "@jig-ui/styles/tokens";
import { focusRing } from "../focus-ring";

/**
 * The row.
 *
 * A flex line with two children: the control — the anchor or button holding
 * the indicator gutter, `start` and the label — and the `end` slot beside it
 * as a sibling. 0014 D1 chose siblings over a stretched link, so there is no
 * overlay here and nothing to lift above one.
 *
 * **The row itself carries no padding.** The control does, which is what makes
 * the clickable area cover the padding rather than stopping at the text; the
 * row's background still covers all of it because the control is inside it.
 * The two padding steps are published as custom properties so the control and
 * the `end` slot can both read whichever size variant is in play.
 */
export const row = recipe({
  base: {
    display: "flex",
    alignItems: "center",
    width: "stretch",
    margin: 0,
    padding: 0,
    borderRadius: radius[400],
    color: color.text.primary,
    fontFamily: type.family.sans,
    // A ListItem rendered as `li` outside a Jig list container should not draw
    // a marker of its own.
    listStyle: "none",
  },
  variants: {
    /**
     * 0014 D5: the ramp is padding, not height. A row's height falls out of
     * its content the way Button's does, so an avatar or an image in `start`
     * makes the row taller instead of overflowing a fixed box.
     *
     * The steps are Button's own — `md` and `lg` share a vertical step, which
     * is that ramp's known irregularity, inherited deliberately rather than
     * quietly corrected here.
     */
    size: {
      sm: {
        vars: { "--jig-listitem-pad-block": spacing[300], "--jig-listitem-pad-inline": spacing[300] },
        gap: spacing[100],
        fontSize: type.scale[200],
      },
      md: {
        vars: { "--jig-listitem-pad-block": spacing[400], "--jig-listitem-pad-inline": spacing[300] },
        gap: spacing[200],
        fontSize: type.scale[300],
      },
      lg: {
        vars: { "--jig-listitem-pad-block": spacing[400], "--jig-listitem-pad-inline": spacing[400] },
        gap: spacing[200],
        fontSize: type.scale[400],
      },
    },
    selected: {
      true: {
        background: color.button.primary.baseBg,
        color: color.button.primary.text,
      },
      false: {},
    },
    /** Only a row that navigates or acts should respond to a pointer. */
    interactive: {
      true: {
        cursor: "pointer",
        ":hover": { background: color.button.ghost.hoverBg },
      },
      false: {},
    },
    /**
     * A disabled button row. Unlike Collapsible's trigger — which Base UI keeps
     * focusable and marks with `aria-disabled` — this is a plain `<button>`
     * with the native attribute, so `:has(:disabled)` is what matches. The row
     * carries the colour because the fill and the label both have to change,
     * and only the row owns the fill.
     */
    disabled: {
      true: {
        color: color.button.ghost.disabledText,
        cursor: "default",
        ":hover": { background: "transparent" },
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      // A selected row already sits at the active fill. Without this it would
      // drop back to the lighter hover fill on hover, which reads as the row
      // becoming *less* selected the moment it is pointed at.
      variants: { interactive: true, selected: true },
      style: { ":hover": { background: color.button.primary.hoverBg } },
    },
  ],
  defaultVariants: {
    size: "md",
    selected: false,
    interactive: false,
    disabled: false,
  },
});

/**
 * The interactive region: everything that is not the `end` slot.
 *
 * 0014 D1's outcome is what this rule implements — the anchor covers the
 * indicator gutter, the `start` slot, the label, and the padding around all
 * three. It owns the padding rather than the row precisely so that the padding
 * is inside the hit area.
 */
export const control = style({
  flex: 1,
  minWidth: 0,
  display: "flex",
  alignItems: "center",
  // The row sets the gap per size; `gap` is not inherited by default, so this
  // asks for it explicitly rather than restating the ramp.
  gap: "inherit",
  padding: "var(--jig-listitem-pad-block) var(--jig-listitem-pad-inline)",
  color: "inherit",
  // An anchor arrives underlined and coloured, and a button arrives wearing
  // the user agent's font — the reset touches neither. Both are defeated here
  // so the row's own type governs.
  font: "inherit",
  textAlign: "left",
  textDecoration: "none",
  background: "transparent",
  border: "none",
  borderRadius: radius[400],
  ...focusRing,
  selectors: {
    // Inset: the control fills the row edge to edge, so an outward ring would
    // be clipped by whatever the sidebar scrolls inside.
    "&:focus-visible": { outlineOffset: "-2px" },
  },
});

/**
 * The `end` slot — the only interactive one, and a sibling of the control
 * rather than a descendant of it (0014 D1). That sibling position is the whole
 * decision: a button here is valid markup and reachable, where nesting it
 * inside the anchor would be neither.
 *
 * It carries the trailing padding, because the control's padding stops at the
 * control.
 */
export const end = style({
  flex: "none",
  display: "flex",
  alignItems: "center",
  gap: spacing[200],
  paddingInlineEnd: "var(--jig-listitem-pad-inline)",
  color: color.text.muted,
});

/**
 * The indicator gutter.
 *
 * 0014 D3, and the mechanism is Combobox's rather than a second invention —
 * see the note on `indicator` in combobox.css.ts. Every row in a list reserves
 * this box whether or not it is the selected one, and `visibility` is what
 * hides the glyph, because `display: none` would surrender the space and let
 * the labels shift by a tick's width as the selection moves.
 */
export const tick = style({
  flex: "none",
  width: "1.25em",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  visibility: "hidden",
});

export const tickVisible = style({ visibility: "visible" });

/**
 * The `start` slot: a fixed minimum width, so labels form one column down the
 * list however wide each row's icon happens to be. What goes in the box is the
 * caller's; the box is the component's — the division `buttonIconSize`
 * establishes for Button.
 */
export const start = style({
  flex: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "1.25em",
});

/** The label. Truncates rather than wrapping, which is what a nav row wants. */
export const label = style({
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});
