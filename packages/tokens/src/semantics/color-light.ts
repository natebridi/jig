import { ThemeTokenSet } from '../types'
import { buttonSet, controlSet, ghostButtonSet, scrollbarSet, sliderSet, tokenSets } from '../utils'

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
        text: {
            primary: {
                '$type': 'color',
                '$value': '{color.warm.600}'
            },
            secondary: {
                '$type': 'color',
                '$value': '{color.gray.500}'
            },
            inverse: {
                '$type': 'color',
                '$value': '{color.warm.25}'
            },
            // Recedes further than secondary — captions, timestamps, and the
            // rest of the text that is present but not being read.
            muted: {
                '$type': 'color',
                '$value': '{color.gray.400}'
            },
            // Tracks the primary button's hue so emphasised text and the
            // primary action read as the same colour idea.
            accent: {
                '$type': 'color',
                '$value': '{color.blue.550}'
            },
            danger: {
                '$type': 'color',
                '$value': '{color.red.550}'
            }
        },
        button: {
            primary: buttonSet('blue', 'light'),
            secondary: buttonSet('warm', 'light'),
            danger: buttonSet('red', 'light'),
            ghost: ghostButtonSet('light')
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
