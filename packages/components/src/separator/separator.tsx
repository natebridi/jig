import type { CSSProperties, Ref } from 'react';
import { separator } from './separator.css';

export type SeparatorOrientation = 'horizontal' | 'vertical';

export interface SeparatorProps {
  /**
   * Which way the rule runs. A vertical separator takes its length from the
   * flex or grid row it sits in, so it renders as nothing outside one.
   */
  orientation?: SeparatorOrientation;
  /**
   * Hides the rule from assistive technology, for a divider that is decoration
   * rather than a boundary.
   *
   * Reach for it wherever the structure already exists in the markup — between
   * buttons in a labelled toolbar, or between items in a list. Leave it off
   * where the rule itself is the only thing marking a boundary, which is when
   * a screen reader user needs to hear about it.
   */
  decorative?: boolean;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A rule that divides content.
 *
 * `orientation="vertical"` takes its length from the flex or grid row it sits
 * in — it has no height of its own, so give it a parent that has one.
 *
 * By default it is announced as a separator. Pass `decorative` where the rule
 * is only visual and the structure is already carried by a labelled group, a
 * list or a heading, so it is not read out as noise.
 *
 * Spacing around it comes from the parent, like every other component.
 *
 * @example
 * <Stack spacing="500">
 *   <Typography as="h2" with="heading04">Ingredients</Typography>
 *   <Separator />
 *   <Typography as="h2" with="heading04">Method</Typography>
 * </Stack>
 *
 * <Stack direction="row" spacing="300" align="center">
 *   <ToggleButton value="bold" isIconOnly icon="star" label="Bold" />
 *   <Separator orientation="vertical" decorative />
 *   <ToggleButton value="italic" isIconOnly icon="heart" label="Italic" />
 * </Stack>
 */
export function Separator({
  orientation = 'horizontal',
  decorative = false,
  className,
  style,
  ref,
}: SeparatorProps) {
  return (
    <div
      ref={ref}
      className={[separator({ orientation }), className].filter(Boolean).join(' ')}
      {...(style ? { style } : {})}
      // A decorative rule carries no role at all: an empty `div` with none
      // contributes nothing to the accessibility tree, so `aria-hidden` would
      // be belt over braces.
      //
      // `aria-orientation` is set for both orientations rather than only for
      // vertical. `horizontal` is understood to be the role's default, which
      // would make it redundant — but the published spec pages could not be
      // read far enough to confirm that, and an explicit value is never wrong
      // where an assumed one might be. See the doc's As built.
      {...(decorative ? {} : { role: 'separator', 'aria-orientation': orientation })}
    />
  );
}
