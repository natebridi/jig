import { recipe } from '@vanilla-extract/recipes'
import { color, type } from "@jig-ui/styles/tokens";

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
            code: {
              fontFamily: type.family.mono,
              color: color.text.primary
            },
            muted: {},
            accent: {},
            danger: {},
        },
    },
})
