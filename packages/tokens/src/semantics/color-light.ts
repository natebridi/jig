import { ThemeTokenSet } from '../types'
import { buttonSet } from '../utils'

export default {
    color: {
        focus: {
            '$type': 'color',
            '$value': '{color.black}'
        },
        surfaces: {
            100: {
                '$type': 'color',
                '$value': '{color.white}'
            },
            200: {
                '$type': 'color',
                '$value': '{color.gray.100}'
            }
        },
        text: {
            primary: {
                '$type': 'color',
                '$value': '{color.gray.800}'
            },
            secondary: {
                '$type': 'color',
                '$value': '{color.gray.700}'
            }
        },
        button: {
            primary: buttonSet('blue'),
            secondary: buttonSet('pink'),
            danger: buttonSet('red')
        }
    }
} as ThemeTokenSet;