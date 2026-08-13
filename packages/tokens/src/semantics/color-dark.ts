import { ThemeTokenSet } from '../types'
import { buttonSet } from '../utils'

export default {
    color: {
        focus: {
            '$type': 'color',
            '$value': '{color.white}'
        },
        surfaces: {
            body: {
                '$type': 'color',
                '$value': '{color.gray.700}'
            },
            card: {
                '$type': 'color',
                '$value': '{color.gray.650}'
            },
            popover: {
                '$type': 'color',
                '$value': '{color.gray.500}'
            },
            // Inverted chrome — tooltips and anything else that must read as
            // sitting above the page rather than on it. Mirrors the body
            // surface and primary text, swapped.
            inverse: {
                '$type': 'color',
                '$value': '{color.gray.100}'
            }
        },
        text: {
            primary: {
                '$type': 'color',
                '$value': '{color.gray.100}'
            },
            secondary: {
                '$type': 'color',
                '$value': '{color.gray.100}'
            },
            inverse: {
                '$type': 'color',
                '$value': '{color.gray.700}'
            }
        },
        button: {
            primary: buttonSet('blue', 'dark'),
            secondary: buttonSet('gray', 'dark'),
            danger: buttonSet('red', 'dark')
        }
    }
} as ThemeTokenSet;
