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
                background: color.primary,
                ':disabled': {
                    background: color.primary
                }
            },
            secondary: { 
                background: color.secondary 
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