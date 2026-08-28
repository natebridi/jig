import { styleVariants } from '@vanilla-extract/css';
import { linkHoverFor } from './link-hover.css';

/**
 * The four text roles, each declaring its colour and its hover pair together
 * — which is the whole mechanism the HoverByRole story is showing. Written
 * with the same `linkHoverFor` helper a real consumer would use, rather than
 * with hand-written custom properties, so the story cannot drift from the
 * thing it documents.
 */
export const role = styleVariants({
  primary: linkHoverFor('primary'),
  secondary: linkHoverFor('secondary'),
  muted: linkHoverFor('muted'),
  danger: linkHoverFor('danger'),
});
