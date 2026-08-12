import { Token, TokenSet } from "../types";

const MIN = 0.25; // in rem
const MAX = 4; // in rem
const MULT = 1.33; // perfect fourth
const start = MAX / Math.pow(MULT, 8);

const formatDTCG = (r: number): Token => {
  return {
    $type: "dimension",
    $value: {
      value: r,
      unit: "rem",
    },
  };
};

const typeScale = (i: number) =>
  Math.round((start * Math.pow(MULT, i) + MIN) * 100) / 100;

export default {
  family: {
    sans: {
      $type: "fontFamily",
      $value: ["Work Sans", "sans-serif"],
    },
    mono: {
      $type: "fontFamily",
      $value: ["Source Code Pro", "monospace"],
    },
    display: {
      $type: "fontFamily",
      $value: ["Amarna", "serif"],
    },
  },
  weight: {
    400: {
      $type: "fontWeight",
      $value: 400,
    },
    500: {
      $type: "fontWeight",
      $value: 500,
    },
    600: {
      $type: "fontWeight",
      $value: 600,
    },
    700: {
      $type: "fontWeight",
      $value: 700,
    },
  },
  scale: {
    100: formatDTCG(typeScale(0)),
    150: formatDTCG(typeScale(0.5)),
    200: formatDTCG(typeScale(1)),
    300: formatDTCG(typeScale(2)),
    400: formatDTCG(typeScale(3)),
    500: formatDTCG(typeScale(4)),
    600: formatDTCG(typeScale(5)),
    700: formatDTCG(typeScale(6)),
    800: formatDTCG(typeScale(7)),
    900: formatDTCG(typeScale(8)),
  },
} as TokenSet;
