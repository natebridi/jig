import { ThemeTokenSet } from '../types'
import { buttonSet, controlSet, ghostButtonSet, scrollbarSet, sliderSet, smokeButtonSet, tokenSets } from '../utils'

export default {
    color: {
        focus: {
            '$type': 'color',
            '$value': '{color.white}'
        },
        surfaces: {
            /**
             * Deeper and truly neutral in dark, where a lifted scrim over an
             * already-dark page separates the two layers less. See 0008 D2.
             */
            scrim: {
                '$type': 'color',
                '$value': {
                    colorSpace: 'oklch',
                    components: [0, 0, 0],
                    alpha: 0.65
                }
            },
            body: {
                '$type': 'color',
                '$value': '{color.warm.750}'
            },
            card: {
                '$type': 'color',
                '$value': '{color.warm.650}'
            },
            popover: {
                '$type': 'color',
                '$value': '{color.warm.500}'
            },
            // Inverted chrome — tooltips and anything else that must read as
            // sitting above the page rather than on it. Mirrors the body
            // surface and primary text, swapped.
            inverse: {
                '$type': 'color',
                '$value': '{color.gray.100}'
            }
        },
        /**
         * The text roles, each paired with the colour a Link hovers to when it
         * has inherited that role. See the light theme for why these are flat
         * `-hover` siblings rather than a nested group.
         *
         * Every hover moves *away* from the surface, which here means lighter
         * — the mirror of the light theme, and the reason the pairs cannot be
         * one shared set. `inverse` inverts again: dark ink on a light
         * surface, so its hover darkens.
         */
        text: {
            primary: {
                '$type': 'color',
                '$value': '{color.gray.100}'
            },
            // gray.100 is already near the top of the ramp, so white is the
            // only remaining step with a visible gap.
            'primary-hover': {
                '$type': 'color',
                '$value': '{color.blue.400}'
            },
            secondary: {
                '$type': 'color',
                '$value': '{color.gray.200}'
            },
            'secondary-hover': {
                '$type': 'color',
                '$value': '{color.gray.50}'
            },
            inverse: {
                '$type': 'color',
                '$value': '{color.gray.700}'
            },
            // Dark ink on a light surface, so this one darkens where the rest
            // of the dark theme lightens.
            'inverse-hover': {
                '$type': 'color',
                '$value': '{color.gray.800}'
            },
            // Recedes further than secondary — captions, timestamps, and the
            // rest of the text that is present but not being read.
            muted: {
                '$type': 'color',
                '$value': '{color.gray.300}'
            },
            'muted-hover': {
                '$type': 'color',
                '$value': '{color.gray.150}'
            },
            // Tracks the primary button's hue so emphasised text and the
            // primary action read as the same colour idea. Lighter than the
            // light theme's step, to hold contrast against a dark surface.
            accent: {
                '$type': 'color',
                '$value': '{color.blue.300}'
            },
            'accent-hover': {
                '$type': 'color',
                '$value': '{color.blue.200}'
            },
            danger: {
                '$type': 'color',
                '$value': '{color.red.300}'
            },
            'danger-hover': {
                '$type': 'color',
                '$value': '{color.red.200}'
            }
        },
        button: {
            primary: buttonSet('blue', 'dark'),
            secondary: buttonSet('gray', 'dark'),
            danger: buttonSet('red', 'dark'),
            ghost: ghostButtonSet('dark'),
            // Translucent, and blurred by the recipe. Its backgrounds are
            // literal oklch rather than aliases because an alias cannot add an
            // alpha channel — see `smokeButtonSet`.
            smoke: smokeButtonSet('dark')
        },
        // Shared by every field-like control rather than scoped to one, so
        // Select and Combobox inherit this surface without another decision.
        control: controlSet('dark'),
        // One soft-fill set per hue rather than a status vocabulary: a
        // Token's colour says which kind of thing it is, not how loud it
        // is. Decided in apps/docs/decisions/0006-token.html (D2).
        token: tokenSets('dark'),
        // Two tokens: the reserved gutter stays empty at rest, so there is
        // no rail to paint. Decided in 0007 D1 and D3.
        scrollbar: scrollbarSet('dark'),
        // The filled track and the thumb. Not `surfaces.inverse`, which the
        // value bubble already uses as inverted chrome, and not `text.*` —
        // a mark is neither.
        slider: sliderSet('dark')
    }
} as ThemeTokenSet;
