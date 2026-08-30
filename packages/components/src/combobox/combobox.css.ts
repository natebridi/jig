import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { color, elevation, radius, size, spacing, type } from "@jig-ui/styles/tokens";
import { linkHoverFor } from "../link/link-hover.css";

export { field, label, description, error } from "../input/input.css";

/**
 * The field box.
 *
 * Input styles the `<input>` itself, because there is nothing else in the box.
 * A Combobox has a caret, and with `multiple` a row of chips, so the border and
 * the height belong to a wrapper and the input inside it is unstyled. Every
 * colour and the height ramp are Input's — `color.control.*` is shared by every
 * field-like control by design, and 0002 D1 derived `size.control` so a
 * bordered control lines up with a Button of the same size.
 */
export const control = recipe({
  base: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    fontFamily: `${type.family.sans}`,
    color: color.control.text,
    background: color.control.baseBg,
    border: `1px solid ${color.control.border}`,
    borderRadius: radius[400],
    cursor: "text",

    ":hover": {
      borderColor: color.control.hoverBorder,
    },

    selectors: {
      // The focus treatment for a control that draws its own border is that
      // border, not the shared ring — spreading `focusRing` here would
      // double-paint, because a field matches `:focus-visible` on click as
      // well as on keyboard focus. 0002 D4.
      "&:has(input:focus)": {
        borderColor: color.control.activeBorder,
        outline: "none",
      },
      // `data-invalid` and `data-disabled` come from Base UI's InputGroup,
      // which mirrors Field's own state — so these track the same source the
      // description and error messages do, rather than sniffing the input.
      "&[data-invalid]": {
        borderColor: color.control.invalidBorder,
      },
      // After the focus rule, so a field being corrected stays marked invalid.
      "&[data-invalid]:has(input:focus)": {
        borderColor: color.control.invalidBorder,
      },
      "&[data-disabled]": {
        background: color.control.disabledBg,
        color: color.control.disabledText,
        cursor: "not-allowed",
      },
    },
  },
  variants: {
    size: {
      sm: {
        minHeight: size.control.sm,
        padding: `0 ${spacing[300]}`,
        gap: spacing[200],
        fontSize: `${type.scale[200]}`,
      },
      md: {
        minHeight: size.control.md,
        padding: `0 ${spacing[400]}`,
        gap: spacing[300],
        fontSize: `${type.scale[300]}`,
      },
      lg: {
        minHeight: size.control.lg,
        padding: `0 ${spacing[400]}`,
        gap: spacing[300],
        fontSize: `${type.scale[400]}`,
      },
    },
    /**
     * With chips in the box the height stops being fixed: chips wrap, and the
     * field grows with them. That reflow is the accepted cost of 0011 D3 —
     * `minHeight` rather than `height` is where it is paid.
     *
     * The vertical padding is `spacing[100]` and cannot be chosen freely.
     * Token derives its own height as `size.control - 2px - 2 * spacing[100]`
     * — the field's height less its two borders and one spacing step of air
     * on each side — so this is the other half of that subtraction. Any other
     * value and a field holding a single chip is taller than an Input beside
     * it, which is exactly what 0006 derived the height to prevent.
     */
    multiple: {
      true: {
        flexWrap: "wrap",
        paddingTop: spacing[100],
        paddingBottom: spacing[100],
        // The same step on the leading edge and between the chips, so a chip
        // is inset by one consistent amount on every side it has a neighbour
        // — the trailing padding stays the size ramp's, because that edge
        // holds the caret and the trigger rather than a chip. Longhands, and
        // declared after `size`, so they win over its `padding` shorthand
        // without disturbing the right-hand side.
        paddingLeft: spacing[100],
        gap: spacing[100],
      },
      false: {},
    },
  },
  defaultVariants: {
    size: "md",
    multiple: false,
  },
});

/**
 * The text input, stripped bare. The wrapper above owns the border, the
 * background and the height, so this contributes nothing but the caret and the
 * query — and has to shrink out of the chips' way rather than pushing them.
 */
export const input = recipe({
  base: {
    appearance: "none",
    flex: "1 1 4ch",
    minWidth: "4ch",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "inherit",
    font: "inherit",
    padding: 0,
    "::placeholder": {
      color: color.control.placeholder,
    },
    selectors: {
      "&:disabled": {
        color: color.control.disabledText,
        cursor: "not-allowed",
      },
      "&:disabled::placeholder": {
        color: color.control.disabledText,
      },
    },
  },
  variants: {
    /**
     * The field's leading padding drops to `spacing[100]` when it holds chips,
     * which is right against a chip and too tight against the caret. This buys
     * the text its air back — from the last chip when there is one, and from
     * the field's own edge when there is not.
     */
    multiple: {
      true: { marginLeft: spacing[400] },
      false: {},
    },
  },
  defaultVariants: { multiple: false },
});

/** Holds the selected Tokens ahead of the input, in source order. */
export const chips = style({
  display: "contents",
});

/**
 * The caret. `margin-left: auto` rather than a spacer, so it stays at the
 * trailing edge whether the box holds a query, chips, or nothing.
 */
export const trigger = style({
  appearance: "none",
  flex: "none",
  marginLeft: "auto",
  display: "flex",
  alignItems: "center",
  border: "none",
  background: "transparent",
  color: color.control.placeholder,
  cursor: "text",
  fontSize: '1.125em',
  lineHeight: 1,
  padding: 0,
  selectors: {
    '&[data-popup-open]': {
      color: color.control.text,
    },
  },
});

/** The popup surface. Elevation and popover colour, both already in the system. */
export const popup = style({
  boxSizing: "border-box",
  // Matches the field, and never narrower. `minWidth` is set inline from the
  // `popupMinWidth` prop when a caller needs the list wider than the control.
  width: "max(var(--anchor-width), var(--jig-combobox-min-width, 0px))",
  maxHeight: "min(20rem, var(--available-height))",
  background: color.surfaces.popover,
  borderRadius: radius[400],
  boxShadow: elevation.med,
  overflow: "hidden",
  /*
   * A flex column, and load-bearing. The ScrollArea inside sizes its viewport
   * by filling a flex parent — as a block child it has no definite height to
   * shrink against, so a long list grew past `maxHeight` and was clipped by
   * `overflow: hidden` with nothing to scroll. Its root already carries
   * `min-height: 0`, so the default `flex: 0 1 auto` lets it shrink when the
   * list is long and stay content-sized when it is short.
   */
  display: "flex",
  flexDirection: "column",
});

export const positioner = style({
  // Base UI positions this; the offset is the one thing worth owning, so the
  // popup clears the field by the same step the field uses internally.
  zIndex: 1,
});

/** Icons in the field and in a row, sized to the text they sit with. */
export const iconSize = "1.15em";

/**
 * The tick's column, and the gap between it and the label.
 *
 * Declared once because three rules depend on the same number: the indicator
 * is this wide, the row's `gap` is what separates it from the label, and a
 * group label has to clear both to line up with the option text. In absolute
 * terms rather than `em` so the group label — which is smaller than an option
 * — indents by the same distance rather than by its own smaller em.
 */
const gutter = `calc(1.15 * ${type.body01.size})`;
const gutterGap = spacing[300];

/** How far the option text sits from the row's own leading padding. */
const textOffset = `calc(${gutter} + ${gutterGap})`;

/**
 * A row's leading padding. One value at every size — the popup is its own
 * surface, so a row is running text rather than part of the control's ramp,
 * and the type does not scale here either.
 */
const itemPadInline = spacing[200];

/** One option row. */
export const item = style({
  display: "flex",
  alignItems: "center",
  gap: gutterGap,
  borderRadius: radius[400],
  cursor: "default",
  padding: `${spacing[300]} ${spacing[300]} ${spacing[300]} ${itemPadInline}`,
  // The popup is portalled to the body, so it inherits nothing from the
  // app's own type. Every text part in here declares its own.
  fontFamily: type.body01.family,
  fontSize: type.body01.size,
  fontWeight: type.body01.weight,
  lineHeight: type.body01.lineHeight,
  // Sets the colour and its link-hover partner together (0010). A row is not
  // a link, but it is text, and the rule is that anything painting a text
  // colour declares the pair beside it.
  ...linkHoverFor("primary"),
  selectors: {
    // Highlight follows the keyboard *and* the pointer, which is Base UI's
    // job to track — one attribute, so the two can never disagree.
    "&[data-highlighted]": {
      background: color.button.ghost.hoverBg,
    },
  },
});

/**
 * The tick, in a gutter at the leading edge that every row reserves whether or
 * not it is selected — so the labels form one column instead of shifting by a
 * tick's width as the selection changes.
 *
 * The element is `keepMounted` so it holds the gutter open on unselected rows;
 * `visibility` rather than `display` is what hides the tick, because the box
 * still has to take up its space.
 */
export const indicator = style({
  flex: "none",
  width: gutter,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: color.text.primary,
  visibility: "hidden",
  selectors: {
    "&[data-selected]": {
      visibility: "visible",
    },
  },
});

/**
 * A group's heading, indented past the tick's gutter so it sits in the same
 * column as the option text rather than out on its own.
 */
export const groupLabel = style({
  padding: `${spacing[300]} ${spacing[300]} ${spacing[200]} calc(${itemPadInline} + ${textOffset})`,
  fontFamily: `${type.family.sans}`,
  fontSize: `${type.scale[200]}`,
  fontWeight: `${type.weight[500]}`,
  lineHeight: type.body01.lineHeight,
  ...linkHoverFor("muted"),
});

/**
 * The empty-state element, which Base UI keeps mounted whatever the list holds
 * — it is a polite live region, and unmounting or hiding it stops screen
 * readers announcing the change. So it carries no padding of its own: with
 * results showing it renders no children, and an empty box with padding is the
 * dead band that used to sit at the top of the popup. The padding is on
 * `emptyMessage` below, which only exists when there is something to say.
 */
export const empty = style({});

export const emptyMessage = style({
  display: "block",
  padding: `${spacing[400]}`,
  fontFamily: `${type.family.sans}`,
  fontSize: `${type.scale[200]}`,
  lineHeight: type.body01.lineHeight,
  ...linkHoverFor("muted"),
});

/**
 * Padding lives here rather than on the popup, so the ScrollArea crops at the
 * popup's edge rather than inside an inset box.
 *
 * No leading padding: it would stack with the row's own and push the tick off
 * centre in its gutter. The rows run to the popup's left edge and their own
 * padding is what positions the tick.
 */
export const list = style({
  padding: `${spacing[200]}`,
});
