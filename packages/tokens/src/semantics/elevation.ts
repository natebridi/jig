import { DimensionTokenValue, ShadowTokenValue, Token, TokenSet } from '../types';

/**
 * Elevation: how far a surface sits above the page.
 *
 * Three steps rather than a numbered ramp, because a shadow is not a scale you
 * interpolate — it is a small set of heights a design system is willing to
 * draw. `lo` lifts a resting surface off the page, `med` is for something
 * summoned but still attached to what opened it, and `hi` is for a layer that
 * has taken over the screen. Dialog takes `hi`.
 *
 * Each is two layers. One tight and nearly opaque for the contact edge, one
 * broad and faint for the ambient falloff; a single layer reads as a grey halo
 * rather than as light. They are written innermost first, which is also the
 * order CSS paints them.
 *
 * The colours are literal rather than aliased, for the same reason
 * `color.surfaces.scrim` is: an alias cannot carry an alpha channel and nothing
 * in the palette is translucent. That means they do not move when the ramps are
 * retuned and have to be checked by eye.
 */

const px = (value: number): DimensionTokenValue => ({ value, unit: 'px' });

const shade = (alpha: number, lightness = 0) => ({
    colorSpace: 'oklch' as const,
    components: [lightness, 0, 0] as [number, number, number],
    alpha,
});

const layer = (
    offsetY: number,
    blur: number,
    spread: number,
    alpha: number
): ShadowTokenValue => ({
    color: shade(alpha),
    offsetX: px(0),
    offsetY: px(offsetY),
    blur: px(blur),
    spread: px(spread),
});

const elevation = (contact: ShadowTokenValue, ambient: ShadowTokenValue): Token => ({
    $type: 'shadow',
    $value: [contact, ambient],
});

/**
 * A shadow is light that a surface blocks, so on a dark page there is far less
 * of it to block — the same alpha that reads as a soft lift on white is
 * invisible on `gray.700`. The dark ramp is roughly four times the opacity at
 * the same geometry, which is what keeps the two themes feeling like the same
 * elevation rather than the same number.
 */
export const elevationLight = {
    elevation: {
        lo: elevation(layer(1, 2, 0, 0.1), layer(1, 3, 0, 0.04)),
        med: elevation(layer(2, 4, -1, 0.14), layer(6, 16, 0, 0.08)),
        hi: elevation(layer(6, 12, -4, 0.18), layer(16, 32, -8, 0.16)),
    },
} as TokenSet;

export const elevationDark = {
    elevation: {
        lo: elevation(layer(1, 2, 0, 0.3), layer(1, 5, 0, 0.3)),
        med: elevation(layer(2, 6, -1, 0.45), layer(6, 16, -2, 0.3)),
        hi: elevation(layer(6, 12, -4, 0.6), layer(16, 32, -8, 0.55)),
    },
} as TokenSet;
