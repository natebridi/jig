import { ThemeTokenSet } from '../types'
import { controlSet, ghostButtonSet, scrollbarSet, sliderSet, smokeButtonSet, toColorTokens, tokenSets } from '../utils'

export default {
    color: {
        /**
         * The colour of a rule that divides.
         *
         * A bare token beside `focus` rather than a set, because a divider needs
         * one colour. Deliberately not `color.control.border`, which is the
         * surface shared by field-like controls — a rule divides where a border
         * encloses, and the two should be free to move apart. Decided in
         * apps/docs/decisions/0012-separator.html (D3).
         */
        line: {
            '$type': 'color',
            '$value': '{color.warm.200}'
        },
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
                '$value': '{color.white}'
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
        /**
         * The button variants, each writing its own mapping out.
         *
         * They shared one — `buttonSet(hue, theme)`, same ramp positions per
         * hue — until 0016 made primary warm, at which point primary and
         * secondary resolved to the same six values. 0016 D3 replaced the
         * shared builder with these; the dark counterparts are in
         * `color-dark.ts` and are named in the notes below wherever a value
         * only makes sense against its opposite.
         */
        button: {
            /**
             * The page's ink, filled in. `warm.600` is already
             * `text.primary`, `surfaces.inverse` and `slider.indicator` here,
             * so primary is not a new colour so much as an existing one given
             * a shape. Dark inverts the relationship rather than mirroring the
             * step: `warm.100` fill with `warm.700` text (0016 D1).
             */
            primary: toColorTokens({
                'base-bg': `{color.warm.650}`,
                'hover-bg': `{color.warm.800}`,
                'active-bg': `{color.warm.800}`,
                'disabled-bg': `{color.warm.150}`,
                'disabled-text': `{color.warm.300}`,
                'text': `{color.warm.50}`
            }),
            /**
             * Quiet: a light fill with ink text, which is what keeps secondary
             * legible beside a primary that is now the same hue. This replaced
             * a mid-tone fill at `warm.450` that was the one combination in the
             * system measured below WCAG AA — 4.35:1, against 10.37:1 here
             * (0016 D2).
             *
             * `base-bg` deliberately matches `button.ghost.hover-bg`, so the
             * two quiet variants share a fill rather than sitting a hair apart.
             * In dark the direction reverses — a *raised* fill at `warm.600`
             * over the darker page — because there is no lighter step to take.
             */
            secondary: toColorTokens({
                'base-bg': `{color.warm.150}`,
                'hover-bg': `{color.warm.250}`,
                'active-bg': `{color.warm.300}`,
                /**
                 * Holds the resting fill rather than taking the shared
                 * `warm.150` the other variants use, and the muted text is
                 * what carries "disabled" — the same answer `smokeButtonSet`
                 * gives, and for the same reason.
                 *
                 * Found in the build: `warm.150` is this variant's *hover*
                 * fill now that secondary sits at the light end of the ramp,
                 * so the inherited disabled fill made a disabled button
                 * indistinguishable from a hovered one. See 0016's As built.
                 */
                'disabled-bg': `{color.warm.100}`,
                'disabled-text': `{color.warm.300}`,
                // Ink on a light fill — the inverse of primary's pairing, and
                // what the 10.37:1 measured in 0016 D2 refers to.
                'text': `{color.warm.600}`
            }),
            /**
             * Unchanged by 0016, and written out here only because the shared
             * builder it used is gone. These are the values `buttonSet('red',
             * 'light')` produced.
             *
             * Known gap: at 4.81:1 this passes WCAG AA but sits at APCA Lc 67.7
             * — below the Lc 75 body minimum — which 0016 D4 recorded as the
             * first thing the APCA work should look at.
             */
            danger: toColorTokens({
                'base-bg': `{color.red.450}`,
                'hover-bg': `{color.red.500}`,
                'active-bg': `{color.red.550}`,
                'disabled-bg': `{color.warm.150}`,
                'disabled-text': `{color.warm.300}`,
                'text': `{color.red.50}`
            }),
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
