import { createVar } from '@vanilla-extract/css';
import { color } from '@jig-ui/styles/tokens';

/**
 * The colour a text Link hovers to.
 *
 * A custom property rather than a fixed token, because a text link inherits
 * its resting colour from whatever encloses it (0009 D3) and CSS gives the
 * link no way to ask what that colour was. So the *parent* declares the pair:
 * anything that sets `color: color.text.X` sets this to `color.text.XHover`
 * beside it, and the link reads it on hover.
 *
 * It lives in its own module rather than in `link.css.ts` because the
 * declaring end is Typography, Dialog and Tooltip — importing `link.css.ts`
 * from those would make three components depend on Link to render their own
 * text.
 *
 * The coupling is the cost of the approach: a component that sets a text
 * colour and forgets this leaves links inside it hovering to the fallback
 * below rather than to its own role. `linkHoverFor` exists so the pairing is
 * one call and hard to half-write.
 */
export const linkHover = createVar();

/**
 * The resting/hover pair for one text role, as a style fragment to spread.
 *
 * @example
 * style({ ...linkHoverFor('secondary') })   // sets colour *and* its hover
 */
export const linkHoverFor = (role: 'primary' | 'secondary' | 'inverse' | 'muted' | 'accent' | 'danger') => ({
  color: color.text[role],
  vars: { [linkHover]: color.text[`${role}Hover` as const] },
});

/**
 * What a link hovers to when nothing above it declared a role.
 *
 * `primary` is the overwhelmingly common case — it is what Typography renders
 * and what body copy is — so an undeclared parent gets the right answer rather
 * than no answer.
 */
export const linkHoverFallback = color.text.primaryHover;
