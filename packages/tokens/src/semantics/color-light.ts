import { ThemeTokenSet } from '../types';

export default {
    color: {
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
        }
    }
} as ThemeTokenSet;