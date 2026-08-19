import { createVar, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { color, radius, size, spacing, type } from "@jig-ui/styles/tokens";
import { focusRing } from "../focus-ring";

/**
 * The pill's own horizontal padding, published as a custom property so the
 * remove button can cancel it. The button's hit area has to run out to the
 * pill's right edge, which means a negative inline-end margin of exactly this
 * value — and it changes per size, so it cannot be a constant in the button's
 * rule. Decided in apps/docs/decisions/0006-token.html (D4).
 */
const padInline = createVar();

/**
 * The hover fill for the interactive parts, set by whichever colour variant is
 * in play. The remove button and a whole-pill link both read it, and neither
 * knows which hue it is inside.
 */
const hoverBg = createVar();

/**
 * One hue's soft fill. Three tokens, no active or disabled state: a Token is a
 * rendered value rather than a control, and 0006 D3 shipped a single visual
 * weight.
 */
const hue = (set: { baseBg: string; hoverBg: string; text: string }) => ({
  background: set.baseBg,
  color: set.text,
  vars: { [hoverBg]: set.hoverBg },
});

export const token = recipe({
  base: {
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    maxWidth: "100%",
    paddingInline: padInline,
    borderRadius: radius[400],
    fontFamily: `${type.family.sans}`,
    fontWeight: `${type.weight[500]}`,
    lineHeight: 1,
    // The pill is an <a> when nothing has to sit beside it, so the anchor
    // styling a host page applies is cancelled here rather than at the call
    // site.
    textDecoration: "none",
    ...focusRing,
  },
  variants: {
    color: {
      warm: hue(color.token.warm),
      cool: hue(color.token.cool),
      blue: hue(color.token.blue),
      teal: hue(color.token.teal),
      green: hue(color.token.green),
      lime: hue(color.token.lime),
      yellow: hue(color.token.yellow),
      orange: hue(color.token.orange),
      red: hue(color.token.red),
      fuschia: hue(color.token.fuschia),
      purple: hue(color.token.purple),
      gray: hue(color.token.gray),
    },
    /**
     * Height is the field's height less its two borders and a spacing step of
     * air on each side, so a Token nests inside the matching Input with 2.68px
     * showing. The subtraction lives here rather than in the token package —
     * 0006 D1 — which is why `semantics/size.ts` carries a note pointing back
     * at this file: retuning `size.control` moves these with it.
     */
    size: {
      sm: {
        lineHeight: `calc(${size.control.sm} - 2px - 2 * ${spacing[100]})`,
        height: `calc(${size.control.sm} - 2px - 2 * ${spacing[100]})`,
        fontSize: `${type.scale[100]}`,
        gap: spacing[100],
        vars: { [padInline]: spacing[300] },
      },
      md: {
        lineHeight: `calc(${size.control.md} - 2px - 2 * ${spacing[100]})`,
        height: `calc(${size.control.md} - 2px - 2 * ${spacing[100]})`,
        fontSize: `${type.scale[200]}`,
        gap: spacing[200],
        vars: { [padInline]: spacing[400] },
      },
      lg: {
        lineHeight: `calc(${size.control.lg} - 2px - 2 * ${spacing[100]})`,
        height: `calc(${size.control.lg} - 2px - 2 * ${spacing[100]})`,
        fontSize: `${type.scale[300]}`,
        gap: spacing[200],
        vars: { [padInline]: spacing[400] },
      },
    },
  },
  defaultVariants: {
    color: "warm",
    size: "md",
  },
});

/**
 * A whole-pill link takes the hover fill. It only ever renders when there is
 * no remove button, so the whole pill really is the anchor and filling it
 * reports the target honestly.
 */
export const linkToken = style({
  ":hover": {
    background: hoverBg,
  },
});

/**
 * The label. Truncates rather than wraps, unconditionally — a two-line token
 * cannot fit a control of fixed height, and the caller caps the width through
 * `style`.
 */
export const label = style({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  minWidth: 0,
});

/**
 * When the pill is both a link and removable the anchor shrinks to the label,
 * because a <button> cannot sit inside an <a>. Underlining on hover rather
 * than filling the pill is what keeps that honest — a fill would claim the
 * whole pill is clickable when only this part is.
 */
export const labelLink = style({
  color: "inherit",
  textDecoration: "none",
  borderRadius: radius[100],
  ...focusRing,
  ":hover": {
    textDecoration: "underline",
    textDecorationThickness: "1px",
    textUnderlineOffset: "2px",
  },
});

/**
 * Icons in a Token are set slightly larger than the label for the same reason
 * they are in a Button — Phosphor's artwork fills its whole viewBox where text
 * leaves room for ascenders. The step is smaller than `buttonIconSize` because
 * a Token's label is smaller relative to its box, and 1.4em would crowd it.
 */
export const tokenIconSize = "1.15em";

/**
 * The remove control, sized for the hit area rather than for the glyph.
 *
 * `align-self: stretch` takes it to the pill's full height, and the negative
 * inline-end margin cancels the pill's own padding — which the button then
 * re-pays as its own, so the target grows to the top, right and bottom edges
 * while the × stays optically where it was. The left edge is the one that
 * stays inside: the label sits there, and it may itself be a link.
 */
export const remove = style({
  appearance: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  alignSelf: "stretch",
  flex: "none",
  fontSize: 'inherit',
  // Content-box so the width below is the glyph, and the padding is the
  // reach on either side of it.
  boxSizing: "content-box",
  width: tokenIconSize,
  paddingBlock: 0,
  paddingInline: spacing[300],
  marginInlineEnd: `calc(-1 * ${padInline})`,
  border: "none",
  // Matches the pill's own corner on the two edges it now reaches.
  borderRadius: `0 ${radius[400]} ${radius[400]} 0`,
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
  ...focusRing,
  ":hover": {
    background: hoverBg,
  },
});
