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
        padding: `0 ${spacing[400]}`,
        gap: spacing[200],
        fontSize: `${type.scale[200]}`,
      },
      md: {
        minHeight: size.control.md,
        padding: `0 ${spacing[500]}`,
        gap: spacing[300],
        fontSize: `${type.scale[300]}`,
      },
      lg: {
        minHeight: size.control.lg,
        padding: `0 ${spacing[500]}`,
        gap: spacing[300],
        fontSize: `${type.scale[400]}`,
      },
    },
    /**
     * With chips in the box the height stops being fixed: chips wrap, and the
     * field grows with them. That reflow is the accepted cost of 0011 D3 —
     * `minHeight` rather than `height` is where it is paid.
     */
    multiple: {
      true: {
        flexWrap: "wrap",
        paddingTop: spacing[200],
        paddingBottom: spacing[200],
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
export const input = style({
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
  cursor: "pointer",
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
  width: "var(--anchor-width)",
  maxHeight: "min(20rem, var(--available-height))",
  background: color.surfaces.popover,
  borderRadius: radius[400],
  boxShadow: elevation.med,
  overflow: "hidden",
});

export const positioner = style({
  // Base UI positions this; the offset is the one thing worth owning, so the
  // popup clears the field by the same step the field uses internally.
  zIndex: 1,
});

/** One option row. */
export const item = recipe({
  base: {
    display: "flex",
    alignItems: "center",
    gap: spacing[300],
    borderRadius: radius[400],
    cursor: "default",
    // Sets the colour and its link-hover partner together (0010). A row is not
    // a link, but it is text, and the rule is that anything painting a text
    // colour declares the pair beside it.
    ...linkHoverFor('primary'),
    selectors: {
      // Highlight follows the keyboard *and* the pointer, which is Base UI's
      // job to track — one attribute, so the two can never disagree.
      "&[data-highlighted]": {
        background: color.button.ghost.hoverBg,
      },
    },
  },
  variants: {
    size: {
      sm: { padding: `${spacing[200]} ${spacing[300]}`, fontSize: `${type.scale[200]}` },
      md: { padding: `${spacing[300]} ${spacing[400]}`, fontSize: `${type.scale[300]}` },
      lg: { padding: `${spacing[300]} ${spacing[400]}`, fontSize: `${type.scale[400]}` },
    },
  },
  defaultVariants: { size: "md" },
});

/** The tick on a selected row. Pushed to the trailing edge. */
export const indicator = style({
  marginLeft: "auto",
  display: "flex",
  alignItems: "center",
  color: color.text.accent,
});

export const groupLabel = style({
  padding: `${spacing[300]} ${spacing[400]} ${spacing[200]}`,
  fontFamily: `${type.family.sans}`,
  fontSize: `${type.scale[200]}`,
  fontWeight: `${type.weight[500]}`,
  ...linkHoverFor('muted'),
});

export const empty = style({
  padding: `${spacing[400]}`,
  fontFamily: `${type.family.sans}`,
  fontSize: `${type.scale[200]}`,
  ...linkHoverFor('muted'),
});

/** Padding lives here rather than on the popup, so the ScrollArea crops at the edge. */
export const list = style({
  padding: spacing[200],
});

/** Icons in the field and in a row, sized to the text they sit with. */
export const iconSize = "1.15em";
