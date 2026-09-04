import { recipe } from "@vanilla-extract/recipes";
import { color } from "@jig-ui/styles/tokens";

/**
 * A one-pixel rule.
 *
 * `color.line` rather than `color.control.border`: a rule divides where a
 * border encloses, and 0012 D3 gave the two separate names so retuning field
 * borders cannot drag every divider in the product with it.
 */
export const separator = recipe({
  base: {
    background: color.line,
    // A flex or grid parent would otherwise be free to squeeze a one-pixel
    // child out of existence when space runs short.
    flex: "none",
  },
  variants: {
    orientation: {
      horizontal: {
        height: "1px",
        width: "stretch",
      },
      vertical: {
        width: "1px",
        /**
         * The length comes from the row, not from a prop — 0012 D4. A vertical
         * rule has no intrinsic height, so outside a flex or grid parent this
         * resolves to nothing and the separator renders invisibly. That is the
         * cost the decision accepted; the prop docs and the story say so,
         * because nothing else can.
         */
        alignSelf: "stretch",
      },
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});
