import type { ReactNode, Ref, SVGAttributes } from 'react';
import { icons, type IconName } from './generated';
import { icon as iconClass } from './icon.css';

export type { IconName };
export type IconWeight = 'regular' | 'fill';

export interface IconProps
  // `role`, `aria-label` and `aria-hidden` are decided together by `label` —
  // letting a caller set one of the three would produce an icon that is
  // half-announced.
  extends Omit<SVGAttributes<SVGSVGElement>, 'children' | 'role' | 'aria-label' | 'aria-hidden'> {
  /** A name from the curated set. Omit when supplying `children` instead. */
  icon?: IconName;
  /** `fill` reads as active, selected or pressed against the default `regular`. */
  weight?: IconWeight;
  /**
   * Any CSS length. Defaults to `1em`, so an icon matches the size of the text
   * it sits in without being told to.
   */
  size?: string | number;
  /**
   * Names the icon for assistive technology. Leave it off when the icon
   * repeats an adjacent label or is purely decorative — which is the common
   * case, and the default.
   */
  label?: string;
  /**
   * Raw SVG content for artwork outside the curated set. Pass the source's own
   * `viewBox` alongside it; everything else — sizing, colour, accessibility —
   * is handled the same way as a built-in icon.
   */
  children?: ReactNode;
  ref?: Ref<SVGSVGElement>;
}

export function Icon({
  icon,
  weight = 'regular',
  size = '1em',
  label,
  viewBox = '0 0 256 256',
  className,
  children,
  ...props
}: IconProps) {
  const path = icon ? icons[icon][weight] : undefined;

  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={size}
      height={size}
      className={[iconClass, className].filter(Boolean).join(' ')}
      // An unlabelled icon is decorative: kept out of the accessibility tree
      // entirely, rather than announced as an anonymous graphic. Set after the
      // spread so this cannot be half-overridden.
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      focusable="false"
    >
      {path ? <path d={path} /> : children}
    </svg>
  );
}
