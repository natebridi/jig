import { HTMLAttributes } from 'react';
import { typography } from './typography.css';

type TypeSizes = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
type TypeStyles = 'heading01' | 'heading02' | 'heading03' | 'body01' | 'body02' | 'caption01' | 'caption02';

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  sizeMin?: TypeSizes;
  sizeMax?: TypeSizes;
  as? : React.ElementType;
  with?: TypeStyles;
}

export function Typography({ sizeMin = '100', sizeMax = '100', with: typeStyle = 'body01', as: Component = 'div', className, children, ...props }: TypographyProps) {
  return (
    <Component
      className={typography({
        sizeMin: sizeMin,
        sizeMax: sizeMax,
        style: typeStyle
      }) + ` fluid-type ` + (className ? ` ${className}` : '')}
      {...props}
    >
      {children}
    </Component>
  );
}
