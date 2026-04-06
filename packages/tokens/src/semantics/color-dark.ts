import { ThemeTokenSet } from '../types'
import { buttonSet } from '../utils'

export default {
    color: {
        focus: {
            '$type': 'color',
            '$value': '{color.white}'
        },
        surfaces: {
            100: {
                '$type': 'color',
                '$value': '{color.gray.800}'
            },
            200: {
                '$type': 'color',
                '$value': '{color.gray.700}'
            }
        },
        text: {
            primary: {
                '$type': 'color',
                '$value': '{color.white}'
            },
            secondary: {
                '$type': 'color',
                '$value': '{color.gray.100}'
            }
        },
        button: {
            primary: buttonSet('blue'),
            secondary: buttonSet('pink'),
            danger: buttonSet('red')
        }
    }
} as ThemeTokenSet;