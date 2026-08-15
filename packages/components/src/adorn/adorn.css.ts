import { recipe } from '@vanilla-extract/recipes'
import { color, type } from "@jig-ui/styles/tokens";

/**
 * Weight and slant are not variants here — `as="strong"` and `as="em"` already
 * carry both the styling and the semantics, and duplicating them as visual-only
 * props invites text that looks emphasised without being announced as such.
 * What is left is the part HTML has no element for: which semantic colour the
 * text takes.
 */
export const adorn = recipe({
    base: {},
    variants: {
        with: {
            muted: {
                color: color.text.muted,
            },
            accent: {
                color: color.text.accent,
            },
            danger: {
                color: color.text.danger,
            },
            mono: {
                fontFamily: type.family.mono,
                color: color.text.primary,
            },
        },
    },
})
