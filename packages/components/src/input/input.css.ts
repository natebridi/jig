import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { color, radius, size, spacing, type } from "@jig-ui/styles/tokens";
import { linkHoverFor } from "../link/link-hover.css";

export const field = style({
  display: "flex",
  flexDirection: "column",
  gap: spacing[200],
  // The control stretches to whatever the caller gives the field, rather than
  // the field shrinking to the control. Width is the parent's business.
  minWidth: 0,
});

export const label = style({
  fontFamily: `${type.family.sans}`,
  fontSize: `${type.scale[200]}`,
  fontWeight: `${type.weight[500]}`,
  lineHeight: 1.2,
  color: color.text.primary,
});

export const control = recipe({
  base: {
    appearance: "none",
    width: "100%",
    minWidth: 0,
    fontFamily: `${type.family.sans}`,
    lineHeight: 1,
    color: color.control.text,
    background: color.control.baseBg,
    border: `1px solid ${color.control.border}`,
    borderRadius: radius[400],
    // Height is declared rather than left to fall out of padding. A button
    // sets `border: none`, so matching its padding here would make the input
    // two pixels taller than the button beside it — the border is exactly the
    // difference. See apps/docs/decisions/0002-text-input.html (D1).
    boxSizing: "border-box",

    "::placeholder": {
      color: color.control.placeholder,
    },

    ":hover": {
      borderColor: color.control.hoverBorder,
    },

    // The focus treatment for a control that already draws a border is the
    // border itself, not the shared focus ring — so `focusRing` is
    // deliberately not spread here, and the UA outline is suppressed in favour
    // of the highlighted border. A ring on top would double-paint the state.
    ":focus": {
      borderColor: color.control.activeBorder,
      outline: "none",
    },

    ":disabled": {
      background: color.control.disabledBg,
      color: color.control.disabledText,
      cursor: "not-allowed",
    },

    selectors: {
      // Validity is Base UI's to track, not ours. Field sets this from native
      // constraint validation, from a `validate` callback, or from the
      // `invalid` prop when an external source owns it.
      "&[data-invalid]": {
        borderColor: color.control.invalidBorder,
      },
      // Declared after the plain `:focus` rule so an invalid field stays
      // marked invalid while it is being corrected.
      "&[data-invalid]:focus": {
        borderColor: color.control.invalidBorder,
      },
      "&[data-disabled]::placeholder": {
        color: color.control.disabledText,
      },
    },
  },
  variants: {
    size: {
      sm: {
        height: size.control.sm,
        padding: `0 ${spacing[400]}`,
        fontSize: `${type.scale[200]}`,
      },
      md: {
        height: size.control.md,
        padding: `0 ${spacing[500]}`,
        fontSize: `${type.scale[300]}`,
      },
      lg: {
        height: size.control.lg,
        padding: `0 ${spacing[500]}`,
        fontSize: `${type.scale[400]}`,
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const description = style({
  fontFamily: `${type.family.sans}`,
  fontSize: `${type.scale[100]}`,
  lineHeight: 1.4,
  // Prose that routinely carries a link ("see accepted cards"), so it
  // declares the hover pair rather than leaving a link inside it to fall
  // back to body copy's. 0010 D1 recorded these as becoming a Typography;
  // they cannot be — see the doc's As built.
  ...linkHoverFor('muted'),
});

export const error = style({
  fontFamily: `${type.family.sans}`,
  fontSize: `${type.scale[100]}`,
  lineHeight: 1.4,
  // Prose that routinely carries a link ("see accepted cards"), so it
  // declares the hover pair rather than leaving a link inside it to fall
  // back to body copy's. 0010 D1 recorded these as becoming a Typography;
  // they cannot be — see the doc's As built.
  ...linkHoverFor('danger'),
});
