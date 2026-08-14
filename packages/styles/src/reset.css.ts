import { globalLayer, globalStyle } from '@vanilla-extract/css'

/**
 * The reset sits in the lowest Jig layer.
 *
 * A reset competes with the *user-agent* stylesheet, and UA styles lose to
 * author styles at any layer — so layering costs it nothing it was actually
 * doing. Leaving it unlayered, on the other hand, puts it above every layer
 * including `jig.components`, where `h1..h6, p { font-size: inherit }` silently
 * flattens Typography's own presets: `<Typography as="h1" with="heading01">`
 * would render at body size.
 *
 * Declared here rather than only wrapped at publish time so that Storybook,
 * which imports this file directly, sees the same cascade the package ships.
 */
export const resetLayer = globalLayer('jig.reset')

globalStyle(':root', {
    '@layer': {
        [resetLayer]: {
            boxSizing: 'border-box'
        }
    }
})

globalStyle('html, body', {
    '@layer': {
        [resetLayer]: {
            margin: 0,
            padding: 0
        }
    }
})

globalStyle('h1, h2, h3, h4, h5, h6, p', {
    '@layer': {
        [resetLayer]: {
            margin: 0,
            padding: 0,
            fontWeight: 'normal',
            fontSize: 'inherit',
            fontStyle: 'normal'
        }
    }
})
