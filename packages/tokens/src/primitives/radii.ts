import { Token, TokenSet } from '../types'

const MAX = 48; // in pixels
const MULT = 1.618;
const start = MAX / Math.pow(MULT, 8);

const formatDTCG = (r:number):Token => {
    return {
        $type: 'dimension',
        $value: {
            value: r,
            unit: 'px'
        }
    }
}

const calcRadius = (i:number) => Math.round( start * Math.pow(MULT, i) * 10 )/10


export default {
    100: formatDTCG(calcRadius(0)),
    200: formatDTCG(calcRadius(1)),
    300: formatDTCG(calcRadius(2)),
    400: formatDTCG(calcRadius(3)),
    500: formatDTCG(calcRadius(4)),
    600: formatDTCG(calcRadius(5)),
    700: formatDTCG(calcRadius(6)),
    800: formatDTCG(calcRadius(7)),
    900: formatDTCG(calcRadius(8)),
} as TokenSet