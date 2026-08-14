import { globalStyle } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { radius, spacing, color, type } from "@jig-ui/styles/tokens";
import { focusRing } from "../focus-ring";
import { icon } from "../icon/icon.css";

export const button = recipe({
  base: {
    appearance: "none",
    fontSize: "1rem",
    border: "none",
    fontFamily: `${type.family.sans}`,
    borderRadius: radius[400],
    padding: `${spacing[500]} ${spacing[600]}`,
    cursor: "pointer",
    // Lets the button own the gap and alignment between an icon and its
    // label, rather than leaving it to whatever the caller composed.
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: '1em',
    ...focusRing,
    ":disabled": {
      pointerEvents: "none",
    }
  },
  variants: {
    color: {
      primary: {
        background: color.button.primary.baseBg,
        color: color.button.primary.text,
        ":hover": {
          background: color.button.primary.hoverBg,
        },
        ":active": {
          background: color.button.primary.activeBg,
        },
        ":disabled": {
          background: color.button.primary.disabledBg,
          color: color.button.primary.disabledText,
        },
      },
      secondary: {
        background: color.button.secondary.baseBg,
        color: color.button.secondary.text,
        ":hover": {
          background: color.button.secondary.hoverBg,
        },
        ":active": {
          background: color.button.secondary.activeBg,
        },
        ":disabled": {
          background: color.button.secondary.disabledBg,
        },
      },
      danger: {
        background: color.button.danger.baseBg,
        color: color.button.danger.text,
        ":hover": {
          background: color.button.danger.hoverBg,
        },
        ":active": {
          background: color.button.danger.activeBg,
        },
        ":disabled": {
          background: color.button.danger.disabledBg,
        },
      },
      // Draws no fill until interacted with, for utility actions that sit on
      // top of another surface.
      ghost: {
        background: "transparent",
        color: color.button.ghost.text,
        ":hover": {
          background: color.button.ghost.hoverBg,
        },
        ":active": {
          background: color.button.ghost.activeBg,
        },
        ":disabled": {
          background: "transparent",
          color: color.button.ghost.disabledText,
        },
      },
    },
    size: {
      sm: {
        padding: `${spacing[300]} ${spacing[400]}`,
        fontWeight: `${type.weight[500]}`,
        fontSize: `${type.scale[200]}`,
        gap: spacing[200],
      },
      md: {
        padding: `${spacing[400]} ${spacing[500]}`,
        fontWeight: `${type.weight[500]}`,
        fontSize: `${type.scale[300]}`,
        gap: spacing[300],
      },
      lg: {
        padding: `${spacing[400]} ${spacing[500]}`,
        fontSize: `${type.scale[400]}`,
        gap: spacing[300],
      },
    },
    // Square padding for a button whose whole content is one icon, so it does
    // not inherit the wide horizontal padding meant for a text label.
    iconOnly: {
      true: {},
      false: {},
    },
    // Held by ToggleButton, which reuses this recipe so it inherits the base,
    // the sizes and the ghost colours. Declared after `color` so it lands later
    // in the stylesheet and wins wherever the two set the same property.
    pressed: {
      true: {
        background: color.button.ghost.hoverBg,
        // Pressed already sits at the ghost hover fill, so hovering and
        // pressing move one step further to stay distinguishable.
        ":hover": {
          background: color.button.ghost.activeBg,
        },
        ":active": {
          background: color.button.ghost.activeBg,
        },
        // Ghost clears its background when disabled, which would leave a
        // disabled toggle looking identical whether it is on or off while
        // aria-pressed still says otherwise. Keep the fill; the muted text
        // colour ghost sets is what carries "disabled".
        ":disabled": {
          background: color.button.ghost.hoverBg,
        },
      },
      false: {},
    },
  },
  compoundVariants: [
    { variants: { iconOnly: true, size: "sm" }, style: { padding: `${spacing[300]} ${spacing[200]}` } },
    { variants: { iconOnly: true, size: "md" }, style: { padding: `${spacing[400]} ${spacing[300]}` } },
    { variants: { iconOnly: true, size: "lg" }, style: { padding: `${spacing[400]} ${spacing[300]}` } },
  ],
  defaultVariants: {
    color: "primary",
  },
});

/**
 * Icons in buttons are set slightly larger than the label. Phosphor's artwork
 * fills its whole viewBox where text leaves room for ascenders, so matching
 * font-size exactly leaves the icon looking undersized. In `em` so it tracks
 * whichever size variant is in play.
 */
export const buttonIconSize = "1.4em";

/**
 * Positioning tweaks for the icon rendered inside a Button go here, so they
 * live with the rest of the button's styling instead of being passed in by
 * each call site. `:where` keeps this at zero specificity, same as the
 * icon's own base styles, so it's still easy to override where a consumer
 * genuinely needs to.
 */
globalStyle(`:where(.${button.classNames.base}) .${icon}`, {
  marginTop: '-.2em',
  marginBottom: '-.2em'
});
