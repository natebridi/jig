import { DimensionTokenValue, Token, TokenSet } from '../types';
import spacing from '../primitives/spacing';
import typePrimitives from '../primitives/type';

const rem = (token: unknown) => ((token as Token).$value as DimensionTokenValue).value;

const scale = (typePrimitives as TokenSet).scale as TokenSet;

/**
 * The height of an interactive control, derived rather than declared.
 *
 * Button sizes itself with padding and a font size and lets the height fall
 * out of the box model. A bordered control cannot do that — `box-sizing:
 * border-box` does not save a box whose height comes from padding, so copying
 * Button's padding onto an input yields a control two pixels taller than the
 * button beside it.
 *
 * So the height Button *already renders* is tokenised here, reached from the
 * same primitives it uses, and bordered controls declare it instead. Same
 * number, one source, and the border stops changing the geometry.
 *
 * Decided in apps/docs/decisions/0002-text-input.html (D1). Retuning these
 * values is the same piece of work as regularising Button's size ramp — they
 * have to move together, or Input and Button separate.
 */
const height = (fontStep: number, padStep: number): Token => ({
    $type: 'dimension',
    $value: {
        value: Math.round((rem(scale[fontStep]) + 2 * rem(spacing[padStep])) * 100) / 100,
        unit: 'rem'
    }
});

export default {
    size: {
        control: {
            // Font step and vertical padding step, matching button.css.ts.
            // md and lg share a padding step there, which is why the ramp is
            // uneven — that irregularity is inherited deliberately.
            sm: height(200, 300),
            md: height(300, 400),
            lg: height(400, 400)
        }
    }
} as TokenSet;
