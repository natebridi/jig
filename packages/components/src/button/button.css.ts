import { recipe } from '@vanilla-extract/recipes';
import { radius, spacing, color } from '@jig-ui/styles/tokens';


export const button = recipe({
    base: {
        appearance: 'none',
        fontSize: '1rem',
        border: 'none',
        borderRadius: radius[500],
        padding: `${spacing[500]} ${spacing[600]}`,
        cursor: 'pointer'
    },
    variants: {
        color: {
            primary: { 
                background: color.button.primary.baseBg,
                color: color.button.primary.text,
                ':hover': {
                    background: color.button.primary.hoverBg
                },
                ':active': {
                    background: color.button.primary.activeBg
                },
                ':disabled': {
                    background: color.button.primary.disabledBg
                }
            },
            secondary: { 
                background: color.button.secondary.baseBg,
                color: color.button.secondary.text,
                ':hover': {
                    background: color.button.secondary.hoverBg
                },
                ':active': {
                    background: color.button.secondary.activeBg
                },
                ':disabled': {
                    background: color.button.secondary.disabledBg
                }
             },
             danger: {
                background: color.button.danger.baseBg,
                color: color.button.danger.text,
                ':hover': {
                    background: color.button.danger.hoverBg
                },
                ':active': {
                    background: color.button.danger.activeBg
                },
                ':disabled': {
                    background: color.button.danger.disabledBg
                }
            }
        },
        size: {
            sm: {
                padding: `${spacing[300]} ${spacing[400]}`,
                fontSize: '0.8rem'
            },
            md: {
                padding: `${spacing[400]} ${spacing[500]}`,
                fontSize: '1rem'
            },
            lg: {
                padding: `${spacing[500]} ${spacing[600]}`,
                fontSize: '1.125rem'
            },
        }
    },
    defaultVariants: {
        color: 'primary'
    }
})