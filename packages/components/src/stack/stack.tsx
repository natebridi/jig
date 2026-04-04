import { HTMLAttributes } from 'react';
import { Responsive, resolveResponsive } from '../responsive';
import { base, direction, stackSpacing, align } from './stack.css';

type StackDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
type StackSpacing = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';

export interface StackProps extends HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  direction?: Responsive<StackDirection>;
  spacing?: Responsive<StackSpacing>;
  align?: Responsive<StackAlign>;
}

export function Stack({
  as: Component = 'div',
  direction: directionProp = 'column',
  spacing: spacingProp = '300',
  align: alignProp = 'start',
  className,
  children,
  ...props
}: StackProps) {
  return (
    <Component
      className={[
        base,
        resolveResponsive(directionProp, direction),
        resolveResponsive(spacingProp, stackSpacing),
        resolveResponsive(alignProp, align),
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </Component>
  );
}
