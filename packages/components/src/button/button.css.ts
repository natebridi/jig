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
    },
    size: {
      sm: {
        padding: `${spacing[300]} ${spacing[400]}`,
        fontWeight: `${type.weight[500]}`,
        fontSize: `${type.scale[200]}`,
      },
      md: {
        padding: `${spacing[400]} ${spacing[500]}`,
        fontSize: `${type.scale[300]}`,
      },
      lg: {
        padding: `${spacing[500]} ${spacing[600]}`,
        fontSize: `${type.scale[400]}`,
      },
    },
  },
  defaultVariants: {
    color: "primary",
  },
});
