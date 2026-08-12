import { Token, TokenSet } from "../types";
import typePrimitives from "../primitives/type";

const textStyle = (family: string, weight: number, scale: number, lineHeight: number): TokenSet => ({
  family: {
    $type: "fontFamily",
    $value: `{type.family.${family}}`,
  } as Token,
  weight: {
    $type: "fontWeight",
    $value: `{type.weight.${weight}}`,
  } as Token,
  size: {
    $type: "dimension",
    $value: `{type.scale.${scale}}`,
  } as Token,
  lineHeight: {
    $type: "number",
    $value: lineHeight,
  } as Token,
});

const typography = {
  ...typePrimitives,
  display01: textStyle("display", 400, 900, 1),
  display02: textStyle("display", 400, 800, 1),
  display03: textStyle("display", 400, 700, 1),
  display04: textStyle("display", 400, 600, 1),
  display05: textStyle("display", 400, 500, 1),
  display06: textStyle("display", 400, 400, 1),
  heading01: textStyle("sans", 600, 800, 1),
  heading02: textStyle("sans", 600, 700, 1),
  heading03: textStyle("sans", 600, 600, 1),
  heading04: textStyle("sans", 600, 500, 1),
  heading05: textStyle("sans", 600, 400, 1),
  heading06: textStyle("sans", 600, 300, 1),
  body01: textStyle("sans", 400, 300, 1.4),
  body02: textStyle("sans", 400, 400, 1.4),
  caption01: textStyle("sans", 400, 100, 1),
  caption02: textStyle("sans", 400, 200, 1),
} as TokenSet;

export default { type: typography } as TokenSet;
