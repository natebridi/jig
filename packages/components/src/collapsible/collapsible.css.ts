import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { color, radius, spacing } from "@jig-ui/styles/tokens";
import { typeStyles } from "../typography/typography.css";
import { focusRing } from "../focus-ring";

/**
 * The root. Block-level and full width, with no surface of its own — 0013 D1
 * chose a plain row, so the collapsible contributes no background, border or
 * padding to whatever it is dropped into.
 */
export const root = style({
  display: "block",
  width: "stretch",
});

/**
 * The trigger.
 *
 * 0013 D1: no fill at rest and *no horizontal padding*, so the label's left
 * edge lines up with the panel copy below it and with the prose around it.
 * That alignment is the whole reason the Button recipe is not reused here —
 * `button()` also sets a font family, size, weight and `line-height: 1em`,
 * every one of which the `with` variant below would then have to beat.
 *
 * `font: inherit` is not enough on its own and is deliberately absent: the
 * `with` variant always sets the four type properties, because 0013 D2 chose
 * an explicit preset over inheritance. What is reset here is only what the
 * user agent draws on a `<button>` that the component has an opinion about.
 */
export const trigger = recipe({
  base: {
    display: "flex",
    alignItems: "center",
    // The label takes the space and the glyph is pushed to the trailing edge.
    // `gap` still guarantees the two never touch when the label fills the row.
    gap: spacing[400],
    width: "stretch",
    padding: `${spacing[400]} 0`,
    margin: 0,
    background: "transparent",
    border: "none",
    // Left, not centre: a full-width trigger centred on its own row would
    // leave the label floating away from the panel content it names.
    textAlign: "left",
    color: color.text.primary,
    cursor: "pointer",
    // Rounds the ring's corners rather than boxing the row squarely. The
    // trigger draws no border of its own, so it takes the ring rather than a
    // border highlight — the checklist's rule, decided in 0002 D4.
    borderRadius: radius[400],
    ...focusRing,
    /**
     * The hover affordance is a colour shift, not a fill. 0013 D1's outcome
     * records this as knowingly quieter than every other pressable thing in
     * Jig: a fill would need horizontal padding to sit in, and that padding is
     * exactly what the decision gave up to keep the label aligned.
     */
    ":hover": {
      color: color.text.muted,
    },
    /**
     * `[aria-disabled]`, not `:disabled`.
     *
     * Base UI builds the trigger with `focusableWhenDisabled: true`, so a
     * disabled trigger never receives the native `disabled` attribute — it
     * stays focusable and carries `aria-disabled="true"` instead, which is
     * what lets a keyboard or screen reader user reach it and be told it is
     * unavailable rather than have it vanish from the tab order.
     *
     * `:disabled` therefore matches nothing here. Found in the playground,
     * where a disabled trigger rendered at full contrast with a pointer
     * cursor; see the doc's As built.
     */
    selectors: {
      '&[aria-disabled="true"]': {
        color: color.text.muted,
        cursor: "default",
      },
    },
  },
  variants: {
    /**
     * A Typography preset. The same `typeStyles` objects Typography's own
     * `style` variant is built from and `Link`'s `with` imports — one map, per
     * the note at the top of typography.css.ts. They carry no colour, so the
     * base's `color` above still governs.
     *
     * Emitted after the base, so a preset wins over anything it sets.
     */
    with: typeStyles,
  },
  defaultVariants: {
    // 0013 D2. Typography's own default, so a trigger with nothing passed
    // matches the body copy it sits among.
    with: "body01",
  },
});

/**
 * The disclosure glyph.
 *
 * 0013 D3 took the plus/minus swap over a rotating caret, which is why there
 * is no `transition` here and no `prefers-reduced-motion` guard around one:
 * two different SVG paths cannot be tweened, so the indicator cuts between
 * states. The guard below belongs to the panel's height alone.
 *
 * Sized in `em` so it tracks whatever `with` set, and pushed to the trailing
 * edge with `margin-inline-start: auto` rather than a spacer element.
 */
export const indicator = style({
  width: "1.15em",
  height: "1.15em",
  flex: "none",
  marginInlineStart: "auto",
});

/**
 * The panel.
 *
 * Base UI measures the content and publishes the result as
 * `--collapsible-panel-height` (an inline style on this element), which is
 * what makes a real height transition possible at all — `auto` is not
 * animatable. The closed keyframes are carried by `[data-starting-style]` and
 * `[data-ending-style]`, which Base UI adds around each transition.
 *
 * 160ms matches scrollarea.css.ts. Jig has no motion tokens, so durations are
 * hand-declared per component and guarded in place; introducing a ramp is its
 * own proposal (0013, settled list).
 */
export const panel = style({
  overflow: "hidden",
  // The fallback is what makes this declaration safe on its own. Base UI writes
  // `--collapsible-panel-height` as an inline style after measuring, but a
  // `var()` with no fallback makes the *whole* declaration invalid while the
  // variable is unset — so `height` would silently fall back to `auto` anyway,
  // just via a thrown-away declaration rather than a stated intent. Saying
  // `auto` outright also survives Base UI renaming the variable.
  height: "var(--collapsible-panel-height, auto)",
  transition: "height 160ms ease-out",
  selectors: {
    "&[data-starting-style], &[data-ending-style]": {
      height: 0,
    },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transition: "none",
    },
  },
});

/**
 * The panel's inner box.
 *
 * The height transition runs on the element above, which means padding on that
 * element would be animated along with the content and would keep the panel a
 * few pixels tall when closed. Content spacing goes here instead, where the
 * measurement can include it without the transition fighting it.
 */
export const content = style({
  paddingBottom: spacing[400],
});
