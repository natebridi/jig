import { ThemeTokenSet } from '../types'
import { buttonSet, controlSet, ghostButtonSet } from '../utils'

export default {
    color: {
        focus: {
            '$type': 'color',
            '$value': '{color.black}'
        },
        surfaces: {
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
        control: controlSet('light')
    }
} as ThemeTokenSet;
