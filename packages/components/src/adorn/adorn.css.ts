import { recipe } from '@vanilla-extract/recipes'
import { type } from "@jig-ui/styles/tokens";
import { linkHoverFor } from "../link/link-hover.css";

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
            // The three colours declare their hover pair alongside the colour,
            // so a Link inside an Adorn hovers to the role it is sitting in.
            // 0010 D4 left the *prop name* alone — this is the wiring, which
            // is neither a rename nor breaking.
            muted: linkHoverFor('muted'),
            accent: linkHoverFor('accent'),
            danger: linkHoverFor('danger'),
            mono: {
                fontFamily: type.family.mono,
                ...linkHoverFor('primary'),
            },
        },
    },
})
