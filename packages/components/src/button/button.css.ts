import { recipe } from "@vanilla-extract/recipes";
import { radius, spacing, color, type } from "@jig-ui/styles/tokens";

export const button = recipe({
  base: {
    appearance: "none",
    fontSize: "1rem",
    border: "none",
    fontFamily: `${type.family.sans}`,
    borderRadius: radius[400],
    padding: `${spacing[500]} ${spacing[600]}`,
    cursor: "pointer",
    ":disabled": {
      pointerEvents: "none",
    },
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
      },
      md: {
        padding: `${spacing[400]} ${spacing[500]}`,
        fontWeight: `${type.weight[500]}`,
        fontSize: `${type.scale[300]}`,
      },
      lg: {
        padding: `${spacing[500]} ${spacing[600]}`,
        fontSize: `${type.scale[400]}`,
      },
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
  defaultVariants: {
    color: "primary",
  },
});
