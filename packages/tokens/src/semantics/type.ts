import { TokenSet } from '../types';
import typePrimitives from '../primitives/type'

const typography = {
    ...typePrimitives,
    heading01 : {
        family: {
            $type: 'fontFamily',
            $value: '{type.family.sans}'
        },
        weight: {
            $type: 'fontWeight',
            $value: '{type.weight.600}'
        },
        size: {
            $type: 'dimension',
            $value: '{type.scale.300}'
        }
    },
    heading02 : {
        family: {
            $type: 'fontFamily',
            $value: '{type.family.sans}'
        },
        weight: {
            $type: 'fontWeight',
            $value: '{type.weight.600}'
        },
        size: {
            $type: 'dimension',
            $value: '{type.scale.400}'
        }
    },
    heading03 : {
        family: {
            $type: 'fontFamily',
            $value: '{type.family.sans}'
        },
        weight: {
            $type: 'fontWeight',
            $value: '{type.weight.600}'
        },
        size: {
            $type: 'dimension',
            $value: '{type.scale.500}'
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
            $value: '{type.scale.300}'
        }
    },
    body02 : {
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
    },
    caption01 : {
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
            $value: '{type.scale.100}'
        }
    },
    caption02 : {
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
            $value: '{type.scale.200}'
        }
    }
} as TokenSet;

export default { type: typography } as TokenSet;