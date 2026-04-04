import { recipe } from '@vanilla-extract/recipes'

export const adorn = recipe({
    base: {},
    variants: {
        with: {
            semibold: {
                fontWeight: 600,
            },
            bold: {
                fontWeight: 700,
            },
            italic: {
                fontStyle: 'italic',
            },
            muted: {},
            accent: {},
            danger: {},
        },
    },
})
