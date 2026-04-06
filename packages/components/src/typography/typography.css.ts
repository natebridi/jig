import { recipe } from '@vanilla-extract/recipes'
import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles'
import { type } from '@jig-ui/styles/tokens'


export const typography = recipe({
    base: {
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    },
    variants: {
        style: {
            heading01: {
                fontFamily: type.heading01.family,
                fontWeight: type.heading01.weight,
                fontSize: type.heading01.size
            },
            heading02: {
                fontFamily: type.heading02.family,
                fontWeight: type.heading02.weight,
                fontSize: type.heading02.size
            },
            heading03: {
                fontFamily: type.heading03.family,
                fontWeight: type.heading03.weight,
                fontSize: type.heading03.size
            },
            body01: {
                fontFamily: type.body01.family,
                fontWeight: type.body01.weight,
                fontSize: type.body01.size
            },
            body02: {
                fontFamily: type.body02.family,
                fontWeight: type.body02.weight,
                fontSize: type.body02.size
            },
            caption01: {
                fontFamily: type.caption01.family,
                fontWeight: type.caption01.weight,
                fontSize: type.caption01.size
            },
            caption02: {
                fontFamily: type.caption02.family,
                fontWeight: type.caption02.weight,
                fontSize: type.caption02.size
            }
        },
        sizeMin: {
            '100': {
                vars: {
                    '--font-size-min': type.scale['100'],
                }
            },
            '200': {
                vars: {
                    '--font-size-min': type.scale['200'],
                }
            },
            '300': {
                vars: {
                    '--font-size-min': type.scale['300'],
                }
            },
            '400': {
                vars: {
                    '--font-size-min': type.scale['400'],
                }
            },
            '500': {
                vars: {
                    '--font-size-min': type.scale['500'],
                }
            },
            '600': {
                vars: {
                    '--font-size-min': type.scale['600']
                }
            },
            '700': {
                vars: {
                    '--font-size-min': type.scale['700']
                }
            },
            '800': {
                vars: {
                    '--font-size-min': type.scale['800']
                }
            },
            '900': {
                vars: {
                    '--font-size-min': type.scale['900']
                }
            }
        },
        sizeMax: {
            '100': {
                vars: {
                    '--font-size': type.scale['100']
                }
            },
            '200': {
                vars: {
                    '--font-size': type.scale['200']
                }
            },
            '300': {
                vars: {
                    '--font-size': type.scale['300']
                }
            },
            '400': {
                vars: {
                    '--font-size': type.scale['400']
                }
            },
            '500': {
                vars: {
                    '--font-size': type.scale['500']
                }
            },
            '600': {
                vars: {
                    '--font-size': type.scale['600']
                }
            },
            '700': {
                vars: {
                    '--font-size': type.scale['700']
                }
            },
            '800': {
                vars: {
                    '--font-size': type.scale['800']                
                }
            },
            '900': {
                vars: {
                    '--font-size': type.scale['900']
                }
            }
        }
    },
    defaultVariants: {
        sizeMin: '100',
        sizeMax: '200'
    }
})