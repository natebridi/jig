import { TokenSet } from '../types';
import typePrimitives from '../primitives/type'

const typography = {
    ...typePrimitives,
    heading01 : {
        family: {
            $type: 'fontFamily',
            $value: '{type.family.display}'
        },
        weight: {
            $type: 'fontWeight',
            $value: '{type.weight.700}'
        },
        size: {
            $type: 'dimension',
            $value: '{type.scale.700}'
        }
    },
    body01 : {
        family: {
            $type: 'fontFamily',
            $value: '{type.family.sans}'
        },
        weight: {
            $type: 'fontWeight',
            $value: '{type.weight.400}'
        },
        size: {
            $type: 'dimension',
            $value: '{type.scale.400}'
        }
    }
} as TokenSet;

export default { type: typography } as TokenSet;