import { ThemeTokenSet } from '../types';

export default {
    color: {
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
        }
    }
} as ThemeTokenSet;