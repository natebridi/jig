import { recipe } from "@vanilla-extract/recipes";
import { type } from "@jig-ui/styles/tokens";
import { linkHoverFor } from "../link/link-hover.css";

/**
 * The type presets, as style objects, keyed by preset name.
 *
 * Named and exported rather than written inline in the recipe below so that a
 * second component can wear a preset without restating sixteen blocks of
 * token references. `Link` is the first: 0009 D3 gave it a `with` prop naming
 * one of these, and two hand-maintained copies of the same sixteen presets is
 * precisely the drift the design system exists to prevent.
 *
 * Only the four type properties. Deliberately no `color` — the recipe's base
 * sets that for Typography, and a Link with a `with` preset still inherits its
 * colour from the parent (0009 D3).
 */
export const typeStyles = {
  display01: {
    fontFamily: type.display01.family,
    fontWeight: type.display01.weight,
    fontSize: type.display01.size,
    lineHeight: type.display01.lineHeight,
  },
  display02: {
    fontFamily: type.display02.family,
    fontWeight: type.display02.weight,
    fontSize: type.display02.size,
    lineHeight: type.display02.lineHeight,
  },
  display03: {
    fontFamily: type.display03.family,
    fontWeight: type.display03.weight,
    fontSize: type.display03.size,
    lineHeight: type.display03.lineHeight,
  },
  display04: {
    fontFamily: type.display04.family,
    fontWeight: type.display04.weight,
    fontSize: type.display04.size,
    lineHeight: type.display04.lineHeight,
  },
  display05: {
    fontFamily: type.display05.family,
    fontWeight: type.display05.weight,
    fontSize: type.display05.size,
    lineHeight: type.display05.lineHeight,
  },
  display06: {
    fontFamily: type.display06.family,
    fontWeight: type.display06.weight,
    fontSize: type.display06.size,
    lineHeight: type.display06.lineHeight,
  },
  heading01: {
    fontFamily: type.heading01.family,
    fontWeight: type.heading01.weight,
    fontSize: type.heading01.size,
    lineHeight: type.heading01.lineHeight,
  },
  heading02: {
    fontFamily: type.heading02.family,
    fontWeight: type.heading02.weight,
    fontSize: type.heading02.size,
    lineHeight: type.heading02.lineHeight,
  },
  heading03: {
    fontFamily: type.heading03.family,
    fontWeight: type.heading03.weight,
    fontSize: type.heading03.size,
    lineHeight: type.heading03.lineHeight,
  },
  heading04: {
    fontFamily: type.heading04.family,
    fontWeight: type.heading04.weight,
    fontSize: type.heading04.size,
    lineHeight: type.heading04.lineHeight,
  },
  heading05: {
    fontFamily: type.heading05.family,
    fontWeight: type.heading05.weight,
    fontSize: type.heading05.size,
    lineHeight: type.heading05.lineHeight,
  },
  heading06: {
    fontFamily: type.heading06.family,
    fontWeight: type.heading06.weight,
    fontSize: type.heading06.size,
    lineHeight: type.heading06.lineHeight,
  },
  body01: {
    fontFamily: type.body01.family,
    fontWeight: type.body01.weight,
    fontSize: type.body01.size,
    lineHeight: type.body01.lineHeight,
  },
  body02: {
    fontFamily: type.body02.family,
    fontWeight: type.body02.weight,
    fontSize: type.body02.size,
    lineHeight: type.body02.lineHeight,
  },
  caption01: {
    fontFamily: type.caption01.family,
    fontWeight: type.caption01.weight,
    fontSize: type.caption01.size,
    lineHeight: type.caption01.lineHeight,
  },
  caption02: {
    fontFamily: type.caption02.family,
    fontWeight: type.caption02.weight,
    fontSize: type.caption02.size,
    lineHeight: type.caption02.lineHeight,
  },
} as const;

/**
 * The semantic text roles, as a variant map.
 *
 * Each case sets the colour *and* the `linkHover` custom property beside it,
 * through `linkHoverFor` — which is the whole point of the axis. A Link
 * anywhere inside inherits the right resting colour and hovers to that role's
 * own partner, with nothing passed at either end. Decided in 0010 D1.
 *
 * All six roles rather than the five that work anywhere: 0010 D3 took
 * `inverse` too. See the note on the `tone` prop for the constraint that
 * carries, which the type system cannot express.
 */
const toneStyles = {
  primary: linkHoverFor('primary'),
  secondary: linkHoverFor('secondary'),
  muted: linkHoverFor('muted'),
  accent: linkHoverFor('accent'),
  danger: linkHoverFor('danger'),
  inverse: linkHoverFor('inverse'),
} as const;

export const typography = recipe({
  base: {
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    lineHeight: 1,
  },
  variants: {
    style: typeStyles,
    // The colour moved out of the base and onto this axis in 0010 D1. The
    // default below keeps `primary`, so nothing already written changes.
    tone: toneStyles,
    /**
     * Lets the browser even out the line lengths instead of filling each line
     * before it breaks. Off by default: `balance` is capped at a handful of
     * lines in every engine that implements it, and applying it to running
     * body text either does nothing or costs a layout pass for no visible
     * gain. Headings, standfirsts and captions are what it is for.
     */
    balance: {
      true: {
        textWrap: "balance",
      },
      false: {},
    },
  },
  defaultVariants: {
    style: "body01",
    tone: "primary",
  },
});
