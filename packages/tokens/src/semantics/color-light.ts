import { ThemeTokenSet } from '../types'
import { buttonSet, ghostButtonSet } from '../utils'

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
            }
        },
        button: {
            primary: buttonSet('blue', 'light'),
            secondary: buttonSet('warm', 'light'),
            danger: buttonSet('red', 'light'),
            ghost: ghostButtonSet('light')
        }
    }
} as ThemeTokenSet;
