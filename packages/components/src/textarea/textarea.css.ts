import { recipe } from "@vanilla-extract/recipes";
import { color, radius, size, spacing, type } from "@jig-ui/styles/tokens";
import { fieldIconSize } from "../input/input.css";

// The field wrapper, the label and the two message styles are Input's, the way
// `combobox.css.ts` already takes them. Three consumers now share them, which
// is the point at which extracting a field module starts to look worthwhile —
// 0020 left that out of scope deliberately rather than by omission.
export { field, label, description, error, fieldIconSize, glyph, slot } from "../input/input.css";

/**
 * The growth envelope, as custom properties.
 *
 * Hand-written names rather than `createVar()`, following `Combobox`'s
 * `--jig-combobox-min-width`: the values come from props at runtime, and the
 * package has no `@vanilla-extract/dynamic` to assign a generated name inline.
 *
 * `HEIGHT` is set by the size variant below; the component sets the other two.
 * Both ends of the envelope are the same shape —
 *
 *     size.control.X + (n - 1) x 1lh
 *
 * *one control height, plus a line for each line after the first*. That
 * identity only holds because the block padding below is derived from the same
 * `size.control.X` (0020 D5); with padding off the spacing ramp the formula
 * would have to spell the padding and the borders out again.
 *
 * Every `var()` here carries a fallback, for the reason `combobox.css.ts`
 * records: an unset variable invalidates the whole declaration, and a silently
 * dropped `max-height` is the failure that lets a field run off the screen.
 * The cap is the asymmetric one — its absence has to read as `max-height:
 * none`, which no arithmetic can produce, so the component hands over a whole
 * value and the stylesheet falls back to `none` when there is no cap.
 */
export const HEIGHT = "--jig-textarea-height";
export const LINES = "--jig-textarea-lines";
export const MAX_HEIGHT = "--jig-textarea-max-height";

/**
 * The multi-line control.
 *
 * Every colour, the border, the radius and the focus treatment are Input's —
 * `color.control.*` is shared by every field-like control by design (0002 D4),
 * and a control that draws its own border highlights *that* on focus rather
 * than spreading `focusRing`.
 *
 * What is new is the block axis. `field-sizing: content` makes the box grow
 * with its value, which also makes `rows` inert — so the line count cannot be
 * an attribute and arrives as `min-height` instead. Baseline since June 2026;
 * Jig takes it natively with no fallback, on the same terms as anchor
 * positioning.
 */
export const control = recipe({
  base: {
    appearance: "none",
    display: "block",
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    // The floor. `3` is the fallback *and* the prop default, so the stylesheet
    // renders a sensible control on its own.
    minHeight: `calc(var(${HEIGHT}) + (var(${LINES}, 3) - 1) * 1lh)`,
    // The cap, or none. See the note on MAX_HEIGHT above.
    maxHeight: `var(${MAX_HEIGHT}, none)`,
    // The whole point of the component, and the reason `rows` and `cols` are
    // omitted from the props: they have no effect once this is set.
    fieldSizing: "content",
    // 0020 D4. Dragging the grip writes an inline height, and an explicit
    // height re-imposes fixed sizing — so the first drag ends the growth for
    // the life of the element. Accepted deliberately: explicit user intent
    // beats an automatic default, and `min-height` / `max-height` clamp any
    // specified height, so the drag cannot leave the envelope below.
    resize: "vertical",
    fontFamily: `${type.family.sans}`,
    // Prose, not a single line — so body copy's line-height rather than
    // Input's `1`. Both `1lh` expressions in this file resolve against it.
    lineHeight: `${type.body01.lineHeight}`,
    color: color.control.text,
    background: color.control.baseBg,
    border: `1px solid ${color.control.border}`,
    borderRadius: radius[400],

    "::placeholder": {
      color: color.control.placeholder,
    },

    ":hover": {
      borderColor: color.control.hoverBorder,
    },

    // See input.css.ts: the focus treatment for a control that already draws a
    // border is the border itself, not the shared ring.
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
      "&[data-invalid]": {
        borderColor: color.control.invalidBorder,
      },
      // After the plain `:focus` rule, so a field stays marked invalid while
      // it is being corrected.
      "&[data-invalid]:focus": {
        borderColor: color.control.invalidBorder,
      },
      "&[data-disabled]::placeholder": {
        color: color.control.disabledText,
      },
    },
  },
  variants: {
    /**
     * The block padding is derived, not taken off the spacing ramp: it is what
     * makes a one-line Textarea exactly `size.control.X` tall, so the first
     * line of text sits where an Input's text sits. Measured at a 16px root —
     * 27.05 / 38.55 / 42.40px against Input's 27.04 / 38.55 / 42.40px. The
     * nearest spacing steps miss by +1.61px at sm and +1.09px at lg.
     *
     * `2px` is the two borders; `1lh` is one line box. Same subtraction
     * `token.css.ts` does against the same token (0006 D1), composed here in
     * the component layer for the same reason. **This file breaks if
     * `size.control` moves — and also if `line-height` above moves.**
     *
     * The inline padding is Input's, unchanged.
     */
    size: {
      sm: {
        vars: { [HEIGHT]: size.control.sm },
        padding: `calc((${size.control.sm} - 2px - 1lh) / 2) ${spacing[300]}`,
        fontSize: `${type.scale[200]}`,
      },
      md: {
        vars: { [HEIGHT]: size.control.md },
        padding: `calc((${size.control.md} - 2px - 1lh) / 2) ${spacing[400]}`,
        fontSize: `${type.scale[300]}`,
      },
      lg: {
        vars: { [HEIGHT]: size.control.lg },
        padding: `calc((${size.control.lg} - 2px - 1lh) / 2) ${spacing[400]}`,
        fontSize: `${type.scale[400]}`,
      },
    },
    /** Set by the component from `icon`, not by the caller. See input.css.ts. */
    hasIcon: {
      true: {},
      false: {},
    },
  },
  // Longhand after the size shorthand, and compounds are emitted last. Same
  // reason as Input's.
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
