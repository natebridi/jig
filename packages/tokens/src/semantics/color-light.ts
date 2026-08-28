import { ThemeTokenSet } from '../types'
import { buttonSet, controlSet, ghostButtonSet, scrollbarSet, sliderSet, smokeButtonSet, tokenSets } from '../utils'

export default {
    color: {
        focus: {
            '$type': 'color',
            '$value': '{color.black}'
        },
        surfaces: {
            /**
             * The dialog scrim.
             *
             * The one semantic in the system whose value is a literal rather
             * than an alias to a primitive, because an alias cannot add an
             * alpha channel and nothing in the palette is translucent. It
             * therefore does not move when the ramps are retuned and has to be
             * checked by eye. Decided in 0008 D2, which records that.
             */
            scrim: {
                '$type': 'color',
                '$value': {
                    colorSpace: 'oklch',
                    components: [0.12, 0, 0],
                    alpha: 0.5
                }
            },
            body: {
                '$type': 'color',
                '$value': '{color.warm.25}'
            },
            card: {
                '$type': 'color',
                '$value': '{color.white}'
            },
            popover: {
                '$type': 'color',
                '$value': '{color.gray.100}'
            },
            // Inverted chrome — tooltips and anything else that must read as
            // sitting above the page rather than on it. Mirrors the body
            // surface and primary text, swapped.
            inverse: {
                '$type': 'color',
                '$value': '{color.warm.600}'
            }
        },
        /**
         * The text roles, each paired with the colour a Link hovers to when it
         * has inherited that role.
         *
         * A `-hover` sibling rather than a nested `{ base, hover }` group: the
         * flat shape is what `TokenGroup` declares and what twenty existing
         * `color.text.X` call sites already read, and nesting would have
         * rewritten all of them to say `.base`. Decided while building 0010.
         *
         * Every hover moves *away* from the surface — darker on light, lighter
         * on dark — so the hovered state can never have less contrast than the
         * resting one. `inverse` is the exception that proves it: it is light
         * ink on a dark surface even in the light theme, so its hover goes
         * lighter here and darker in dark.
         */
        text: {
            primary: {
                '$type': 'color',
                '$value': '{color.warm.600}'
            },
            'primary-hover': {
                '$type': 'color',
                '$value': '{color.blue.500}'
            },
            secondary: {
                '$type': 'color',
                '$value': '{color.gray.500}'
            },
            'secondary-hover': {
                '$type': 'color',
                '$value': '{color.gray.650}'
            },
            inverse: {
                '$type': 'color',
                '$value': '{color.warm.25}'
            },
            // Light ink on a dark surface, so "away from the surface" is
            // lighter. warm.25 is already near the top of the ramp; white is
            // the only step with a visible gap left.
            'inverse-hover': {
                '$type': 'color',
                '$value': '{color.white}'
            },
            // Recedes further than secondary — captions, timestamps, and the
            // rest of the text that is present but not being read.
            muted: {
                '$type': 'color',
                '$value': '{color.gray.400}'
            },
            'muted-hover': {
                '$type': 'color',
                '$value': '{color.gray.550}'
            },
            // Tracks the primary button's hue so emphasised text and the
            // primary action read as the same colour idea.
            accent: {
                '$type': 'color',
                '$value': '{color.blue.550}'
            },
            'accent-hover': {
                '$type': 'color',
                '$value': '{color.blue.650}'
            },
            danger: {
                '$type': 'color',
                '$value': '{color.red.550}'
            },
            'danger-hover': {
                '$type': 'color',
                '$value': '{color.red.650}'
            }
        },
        button: {
            primary: buttonSet('blue', 'light'),
            secondary: buttonSet('warm', 'light'),
            danger: buttonSet('red', 'light'),
            ghost: ghostButtonSet('light'),
            // Translucent, and blurred by the recipe. Its backgrounds are
            // literal oklch rather than aliases because an alias cannot add an
            // alpha channel — see `smokeButtonSet`.
            smoke: smokeButtonSet('light')
        },
        // Shared by every field-like control rather than scoped to one, so
        // Select and Combobox inherit this surface without another decision.
        control: controlSet('light'),
        // One soft-fill set per hue rather than a status vocabulary: a
        // Token's colour says which kind of thing it is, not how loud it
        // is. Decided in apps/docs/decisions/0006-token.html (D2).
        token: tokenSets('light'),
        // Two tokens: the reserved gutter stays empty at rest, so there is
        // no rail to paint. Decided in 0007 D1 and D3.
        scrollbar: scrollbarSet('light'),
        // The filled track and the thumb. Not `surfaces.inverse`, which the
        // value bubble already uses as inverted chrome, and not `text.*` —
        // a mark is neither.
        slider: sliderSet('light')
    }
} as ThemeTokenSet;
