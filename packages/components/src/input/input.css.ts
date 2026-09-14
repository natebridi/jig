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

/**
 * The leading icon's size, in `em` so it tracks the size ramp's font size
 * without a variant of its own. The same 1.15em `Combobox` gives its caret and
 * `Token` its remove control — a field's glyph is one value across the system.
 */
export const fieldIconSize = "1.15em";

/**
 * The positioning context for an overlaid leading icon.
 *
 * 0020 D2 kept the control as the bordered box and laid the icon over it,
 * rather than moving the border to a wrapper the way `combobox.css.ts` does.
 * The trade is recorded there: a Combobox has interactive children that must be
 * in flow, a decorative glyph does not — and a wrapper puts a textarea's resize
 * grip one padding step inside the border instead of on it.
 *
 * Only rendered when there is an icon, so a field without one keeps exactly the
 * DOM it shipped with.
 */
export const slot = style({
  position: "relative",
  display: "block",
  minWidth: 0,
});

/**
 * The icon itself.
 *
 * One offset expression serves both controls:
 * `calc((size.control.X - iconSize) / 2)` centres the glyph on a single-line
 * control *and* on a Textarea's first line box. That only holds because 0020 D5
 * derives the textarea's block padding from the same `size.control.X` — change
 * that and this needs two expressions. See textarea.css.ts.
 *
 * `font-size` is restated per size so the `em` here and the `em` in the
 * control's leading padding resolve against the same number.
 */
export const glyph = recipe({
  base: {
    position: "absolute",
    color: color.control.placeholder,
    lineHeight: 1,
    // Decorative and non-interactive (0020, settled): a click anywhere over
    // the glyph still lands on the control behind it.
    pointerEvents: "none",
  },
  variants: {
    size: {
      sm: {
        fontSize: `${type.scale[200]}`,
        insetInlineStart: spacing[300],
        top: `calc((${size.control.sm} - ${fieldIconSize}) / 2)`,
      },
      md: {
        fontSize: `${type.scale[300]}`,
        insetInlineStart: spacing[400],
        top: `calc((${size.control.md} - ${fieldIconSize}) / 2)`,
      },
      lg: {
        fontSize: `${type.scale[400]}`,
        insetInlineStart: spacing[400],
        top: `calc((${size.control.lg} - ${fieldIconSize}) / 2)`,
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
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
        padding: `0 ${spacing[300]}`,
        fontSize: `${type.scale[200]}`,
      },
      md: {
        height: size.control.md,
        padding: `0 ${spacing[400]}`,
        fontSize: `${type.scale[300]}`,
      },
      lg: {
        height: size.control.lg,
        padding: `0 ${spacing[400]}`,
        fontSize: `${type.scale[400]}`,
      },
    },
    /**
     * Buys the leading padding back from the overlaid icon. Set by the
     * component from `icon`, not by the caller.
     */
    hasIcon: {
      true: {},
      false: {},
    },
  },
  // A compound variant rather than a `hasIcon` style, because the size
  // variants declare `padding` as a shorthand and recipe variants are emitted
  // in declaration order — a `paddingInlineStart` inside `hasIcon` would be
  // overwritten by whichever size followed it. Compounds are emitted last, so
  // this is the one place the longhand reliably wins. Button's `iconOnly`
  // padding is compounded for the same reason.
  compoundVariants: [
    {
      variants: { hasIcon: true, size: "sm" },
      style: { paddingInlineStart: `calc(${spacing[300]} + ${fieldIconSize} + ${spacing[200]})` },
    },
    {
      variants: { hasIcon: true, size: "md" },
      style: { paddingInlineStart: `calc(${spacing[400]} + ${fieldIconSize} + ${spacing[300]})` },
    },
    {
      variants: { hasIcon: true, size: "lg" },
      style: { paddingInlineStart: `calc(${spacing[400]} + ${fieldIconSize} + ${spacing[300]})` },
    },
  ],
  defaultVariants: {
    size: "md",
    hasIcon: false,
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
