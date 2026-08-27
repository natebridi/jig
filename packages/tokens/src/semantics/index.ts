import { TokenSet } from '../types';
import colorLight from './color-light'
import colorDark from './color-dark'
import typography from './type'
import radius from './radii'
import spacing from './spacing'
import size from './size'
import { elevationLight, elevationDark } from './elevation'

export default {
    colorLight,
    colorDark,
    // Theme contexts too: a shadow's opacity has to change with the surface
    // behind it, so these are swapped by the theme modifier alongside colour.
    elevationLight,
    elevationDark,
    typography,
    radius,
    spacing,
    size
} as TokenSet;