import { HTMLAttributes } from 'react';
import { Responsive, resolveResponsive } from '../responsive';
import { splitSpacing, type SpacingProps } from '../spacing';
import { splitBoxSize, type BoxSizeProps } from '../box-size';
import { base, gridSpacing, gridColumns } from './grid.css';

type GridSpacing = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface GridProps extends HTMLAttributes<HTMLElement>, SpacingProps, BoxSizeProps {
  as?: React.ElementType;
  spacing?: Responsive<GridSpacing>;
  columns?: Responsive<GridColumns> | number;
}

export function Grid({
  as: Component = 'div',
  spacing: spacingProp = '300',
  columns: columnsProp = 1,
  className,
  style,
  children,
  ...props
}: GridProps) {
  const { spacing, rest: afterSpacing } = splitSpacing(props);
  const { style: boxStyle, rest } = splitBoxSize(afterSpacing);

  return (
    <Component
      className={[
        base,
        resolveResponsive(spacingProp, gridSpacing),
        resolveResponsive(columnsProp as string, gridColumns),
        spacing,
        className,
      ].filter(Boolean).join(' ')}
      style={{ ...boxStyle, ...style }}
      {...rest}
    >
      {children}
    </Component>
  );
}
