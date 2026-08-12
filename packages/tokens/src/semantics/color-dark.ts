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
            }
        },
        button: {
            primary: buttonSet('blue', 'dark'),
            secondary: buttonSet('gray', 'dark'),
            danger: buttonSet('red', 'dark')
        }
    }
} as ThemeTokenSet;
