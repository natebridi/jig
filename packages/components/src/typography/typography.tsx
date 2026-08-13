import { HTMLAttributes } from 'react';
import { splitSpacing, type SpacingProps } from '../spacing';
import { typography } from './typography.css';

type TypeSizes = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
type TypeStyles =
  | 'display01' | 'display02' | 'display03' | 'display04' | 'display05' | 'display06'
  | 'heading01' | 'heading02' | 'heading03' | 'heading04' | 'heading05' | 'heading06'
  | 'body01' | 'body02' | 'caption01' | 'caption02';

export interface TypographyProps extends HTMLAttributes<HTMLElement>, SpacingProps {
  sizeMin?: TypeSizes;
  sizeMax?: TypeSizes;
  as? : React.ElementType;
  with?: TypeStyles;
}

export function Typography({ sizeMin = '100', sizeMax = '100', with: typeStyle = 'body01', as: Component = 'div', className, children, ...props }: TypographyProps) {
  const { spacing, rest } = splitSpacing(props);

  return (
    <Component
      className={[
        typography({
          sizeMin: sizeMin,
          sizeMax: sizeMax,
          style: typeStyle
        }),
        'fluid-type',
        spacing,
        className,
      ].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </Component>
  );
}
