import { Token, TokenSet } from "../types";

const MAX = 8; // in pixels
const MULT = 1.618;
const start = MAX / Math.pow(MULT, 8);

const formatDTCG = (r:number):Token => {
    return {
        $type: 'dimension',
        $value: {
            value: r,
            unit: 'rem'
        }
    }
}

const calcSpacing = (i:number) => Math.round( start * Math.pow(MULT, i) * 100 )/100


export default {
    100: formatDTCG(calcSpacing(0)),
    200: formatDTCG(calcSpacing(1)),
    300: formatDTCG(calcSpacing(2)),
    400: formatDTCG(calcSpacing(3)),
    500: formatDTCG(calcSpacing(4)),
    600: formatDTCG(calcSpacing(5)),
    700: formatDTCG(calcSpacing(6)),
    800: formatDTCG(calcSpacing(7)),
    900: formatDTCG(calcSpacing(8)),
} as TokenSet