import { recipe } from "@vanilla-extract/recipes";
import { color, type } from "@jig-ui/styles/tokens";

export const typography = recipe({
  base: {
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    color: color.text.primary,
    lineHeight: 1,
  },
  variants: {
    style: {
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
    },
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
  },
});
