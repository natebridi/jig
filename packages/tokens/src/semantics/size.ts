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
 *
 * A second consumer subtracts from these rather than declaring its own ramp:
 * Token's height is `calc(size.control.X - 2px - 2 * spacing.100)`, composed in
 * packages/components/src/token/token.css.ts so that it nests inside a field
 * with the border and a spacing step of air on each side. That subtraction is
 * deliberately *not* tokenised here — 0006 D1 chose the component layer — so
 * this note is the only signal that moving these values moves Token too.
 */
const height = (fontStep: number, padStep: number): Token => ({
    $type: 'dimension',
    $value: {
        value: Math.round((rem(scale[fontStep]) + 2 * rem(spacing[padStep])) * 100) / 100,
        unit: 'rem'
    }
});

/**
 * A dialog's width.
 *
 * Off the ratio ramp, and knowingly: the spacing ramp tops out at 8rem and the
 * type scale does not apply, so these three are chosen by eye. They are named
 * here rather than spelled into dialog.css.ts so that the one place a reader
 * looks for a system dimension is the place they are written down. Decided in
 * apps/docs/decisions/0008-dialog.html (D4), which records that cost.
 *
 * The viewport cap — min(width, 100vw - 2rem) — is the component's, not a
 * token: it depends on the runtime viewport, which the token layer cannot see.
 */
const width = (value: number): Token => ({
    $type: 'dimension',
    $value: { value, unit: 'rem' }
});

export default {
    size: {
        dialog: {
            sm: width(22),
            md: width(30),
            lg: width(42)
        },
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
