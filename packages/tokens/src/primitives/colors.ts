import { TokenSet, Token }  from "../types";

type Luminosity = {
    label_min: number;
    label_max: number;
    label_increment: number;
    min: number;
    max: number;
}

const colorConfig: any = {
    green: {
        luminosity: {
            label_min: 100,
            label_max: 900,
            label_increment: 100,
            min: 0.2,
            max: 0.95
        },
        chroma: {
            base: 0.2072,
            weak: 0.1,
            strong: 0.3
        },
        hue: 155.12
    },
    pink: {
        luminosity: {
            label_min: 100,
            label_max: 900,
            label_increment: 100,
            min: 0.1,
            max: 0.95
        },
        chroma: {
            base: 0.1825,
            weak: 0.1,
            strong: 0.25
        },
        hue: 331.94
    },
    gray: {
        luminosity: {
            label_min: 50,
            label_max: 900,
            label_increment: 50,
            min: 0.1,
            max: 0.95
        },
        chroma: 0.03,
        hue: 262.06
    },
    blue: {
        luminosity: {
            label_min: 100,
            label_max: 900,
            label_increment: 100,
            min: 0.3,
            max: 0.95
        },
        chroma: {
            base: 0.1751,
            weak: 0.08,
            strong: 0.25
        },
        hue: 236.65
    },
    orange: {
        luminosity: {
            label_min: 100,
            label_max: 900,
            label_increment: 100,
            min: 0.1,
            max: 0.9
        },
        chroma: {
            base: 0.1949,
            weak: 0.12,
            strong: 0.25
        },
        hue: 51.35
    },
    red: {
        luminosity: {
            label_min: 100,
            label_max: 900,
            label_increment: 100,
            min: 0.1,
            max: 0.9
        },
        chroma: {
            base: 0.2171,
            weak: 0.12,
            strong: 0.25
        },
        hue: 23.82
    },
    black: {
        luminosity: 0,
        chroma: 0,
        hue: 0
    },
    white: {
        luminosity: 1,
        chroma: 0,
        hue: 0
    },
}

const formatOklch = (l: number, c: number, h: number) => {
    return {
        '$type': 'color',
        '$value': {
            colorSpace: "oklch",
            components: [l, c, h],
            alpha: 1
        }
    }
}

const generateScale = (luminosity: Luminosity, chroma: number, hue: number) => {
    const { label_min, label_max, label_increment, min, max } = luminosity;
    const label_steps = (label_max - label_min) / label_increment + 1;
    const luminosity_increment =(max-min)/(label_steps-1);

    let stepsObj = {};
    for (let i = 0; i < label_steps; i++) {
        stepsObj = Object.assign({}, stepsObj, {
            [label_increment*(i+1)]: formatOklch(max-luminosity_increment*i, chroma, hue)
        });
    }
    return stepsObj;
}

// @ts-expect-error
const palette = Object.keys(colorConfig).reduce((prior, colorLabel) => {
    const colorObj = colorConfig[colorLabel];
    const { luminosity, chroma, hue } = colorObj;

    if (typeof luminosity === 'number') {
        if (typeof chroma === 'number') {
            return Object.assign({}, prior, {
                [colorLabel]: formatOklch(luminosity, chroma, hue)
            });
        } else {
            // not handled
        }
    } else if (typeof luminosity === 'object') {
        if (typeof chroma === 'number') {
            return Object.assign({}, prior, {
                [colorLabel]: generateScale(luminosity, chroma, hue)
            });
        } else if (typeof chroma === 'object') {
            let compiledColorObj = {}

            compiledColorObj = {
                [colorLabel]: generateScale(luminosity, chroma.base, hue)
            }

            // @ts-expect-error
            compiledColorObj[colorLabel] = Object.assign({}, { 'weak': generateScale(luminosity, chroma.weak, hue) }, compiledColorObj[colorLabel]);
            // @ts-expect-error
            compiledColorObj[colorLabel] = Object.assign({}, { 'strong': generateScale(luminosity, chroma.strong, hue) }, compiledColorObj[colorLabel]);

            return Object.assign({}, prior, compiledColorObj);
        }
    }

}, {});

// @ts-expect-error
export default {
    color: palette
} as TokenSet;